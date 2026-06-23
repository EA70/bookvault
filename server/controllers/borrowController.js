
const pool = require("../config/connexionDB");
const { sendOverdueReminder } = require("../middlewares/emailService.js");

 
/** * Valide le panier d'emprunt (Ajout de plusieurs emprunts d'un coup)
 * Le joyau qui valide la corbeille 
 * des livres pour pouvoir la requete de confirmation a 
 * l admin !!!
 */
  const validateCartEmprunt = async (req, res) => {
    const { bookIds } = req.body;  
    const { sessionRef } = req;  

    if (!bookIds?.length || !Array.isArray(bookIds)) {
      return res.status(400).json({ message: "Le panier est vide ou invalide." });
    }

    const client = await pool.connect();
    
    try {
      await client.query("BEGIN");

      // 1. Vérification de l'utilisateur via sa session
      const userCheck = await client.query(
        "SELECT id, is_blocked FROM users WHERE session_reference = $1",
        [sessionRef]
      );

      if (!userCheck.rows.length) {
        throw new Error("Votre session est invalide ou a expiré. Veuillez vous reconnecter.");
      }

      const [{ id: userId, is_blocked }] = userCheck.rows; 

      if (is_blocked) {
        throw new Error("Votre compte est actuellement bloqué. Emprunt impossible.");
      }

      // 2. Boucle de traitement des demandes de livres
      for (let bookId of bookIds) {
        bookId = parseInt(bookId, 10);
        if (isNaN(bookId)) continue;
        
        // On vérifie si le livre existe et s'il reste des copies théoriques
        const bookCheck = await client.query(
          "SELECT copies_available, title FROM books WHERE id = $1", 
          [bookId]
        );

        if (!bookCheck.rows.length) {
          throw new Error("Un des livres demandés n'existe pas.");
        }

        const [{ copies_available, title }] = bookCheck.rows;

        if (copies_available <= 0) {
          throw new Error(`Désolé, le livre "${title}" n'est plus disponible pour le moment.`);
        }
        // Le stock (UPDATE books) a été SUPPRIMÉ d'ici car l'admin le fera plus tard.
        await client.query(
          `INSERT INTO borrows (user_id, book_id, status, borrowed_at) 
          VALUES ($1, $2, 'en_attente_remise', CURRENT_TIMESTAMP)`,
          [userId, bookId]
        );
      }

      await client.query("COMMIT");
      res.status(201).json({ 
        message: "Votre demande d'emprunt a été enregistrée ! Veuillez vous rendre au guichet pour récupérer vos livres." 
      });

    } catch (error) {
      await client.query("ROLLBACK"); 
      console.error("Erreur transaction emprunt:", error.message);
      res.status(500).json({ message: error.message ?? "Erreur lors de la validation." }); // ES6+ : Opérateur ??
    } finally {
      client.release();
    }
};


/**
 * Cette fonction récupère la liste complète des demandes au statut 'en_attente_remise' en 
 * effectuant les jointures (JOIN) 
 * nécessaires pour afficher 
 * l'identité de l'étudiant et les 
 * informations du livre.
 * 
 */
const getPendingBorrows = async (req, res) => {
  try {
    const query = `
      SELECT 
        b.id AS borrow_id,
        b.status,
        b.borrowed_at AS requested_at,
        u.id AS user_id,
        u.first_name,
        u.last_name,
        u.email,
        bk.id AS book_id,
        bk.title,
        bk.author,
        bk.copies_available
      FROM borrows b
      JOIN users u ON b.user_id = u.id
      JOIN books bk ON b.book_id = bk.id
      WHERE b.status = 'en_attente_remise'
      ORDER BY b.borrowed_at DESC
    `;

    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Erreur récupération demandes Admin :", error.message);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des demandes." });
  }
};



/**
 * 
 * L'administration envoie une requête POST ou PUT 
 * avec la décision dans le corps du message 
 * (status: "accepte" ou "refuse").
 * 
 */

const handleBorrowDecision = async (req, res) => {
  const { borrowId } = req.params;
  const { action } = req.body;  

  if (!["accepte", "refuse"].includes(action)) {
    return res.status(400).json({ message: "Action invalide. Choisissez 'accepte' ou 'refuse'." });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Récupérer la demande actuelle et la verrouiller (FOR UPDATE)
    const borrowCheck = await client.query("SELECT user_id, book_id, status FROM borrows WHERE id = $1 FOR UPDATE",[borrowId]);

    if (!borrowCheck.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Cette demande d'emprunt n'existe pas." });
    }

    const [{ user_id: userId, book_id: bookId, status: currentStatus }] = borrowCheck.rows;

    if (currentStatus !== "en_attente_remise") {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Cette demande a déjà été traitée." });
    }

    // LE REFUS DE L'ADMIN
    if (action === "refuse") {
      // On supprime la ligne pour libérer proprement le quota de l'étudiant immédiatement
      await client.query(
    `UPDATE borrows 
     SET status = 'refuse', 
         returned_at = CURRENT_TIMESTAMP -- On utilise ce champ comme date de fin de traitement
     WHERE id = $1`, 
    [borrowId]
  );
      await client.query("COMMIT");
      return res.status(200).json({ message: "La demande d'emprunt a été refusée et annulée." });
    }

    // LA VALIDATION (L'admin valide et remet le livre)
    // 1. On compte le nombre total de livres déjà possédés ou déjà acceptés
    const countCheck = await client.query(
      `SELECT COUNT(*) FROM borrows 
       WHERE user_id = $1 
         AND status = 'emprunte'`, //On ne compte QUE ceux qu'il a déjà physiquement chez lui !
      [userId]
    );
    const booksAlreadyBorrowed = parseInt(countCheck.rows[0].count, 10);

    // 2. On compte combien de demandes en attente il a (hors celle qu'on est en train de valider)
    const pendingCheck = await client.query(
      `SELECT COUNT(*) FROM borrows 
       WHERE user_id = $1 
         AND status = 'en_attente_remise'
         AND id <> $2`, 
      [userId, borrowId]
    );
    const otherPendingRequests = parseInt(pendingCheck.rows[0].count, 10);

    // Total = Livres déjà à la maison + Ce qu'on valide aujourd'hui (1)
    const totalActiveBorrows = booksAlreadyBorrowed + 1;

    // Si l'étudiant dépasse le quota maximum de 3 livres possédés en même temps
    if (totalActiveBorrows > 3) {
      throw new Error(`Limite atteinte : Cet étudiant possède déjà ${booksAlreadyBorrowed} livre(s) chez lui. La validation de ce livre dépasserait le quota maximum de 3 livres.`);
    }

    // L'étudiant ne peut pas emprunter le MÊME livre deux fois en même temps
    const duplicateCheck = await client.query(
      "SELECT COUNT(*) FROM borrows WHERE user_id = $1 AND book_id = $2 AND status = 'emprunte'",
      [userId, bookId]
    );
    
    if (parseInt(duplicateCheck.rows[0].count, 10) > 0) {
      throw new Error("Doublon interdit : Cet étudiant possède déjà un exemplaire actif de ce livre chez lui.");
    }

    // Vérifier et verrouiller le stock physique du livre
    const bookCheck = await client.query(
      "SELECT copies_available, title FROM books WHERE id = $1 FOR UPDATE",
      [bookId]
    );

    if (!bookCheck.rows.length) {
      throw new Error("Le livre associé à cette demande n'existe pas.");
    }

    const [{ copies_available, title }] = bookCheck.rows;

    if (copies_available <= 0) {
      throw new Error(`Le stock physique pour "${title}" est épuisé.`);
    }

    // TOUT EST OK -> Passage en statut 'emprunte' et initialisation de la date d'emprunt
    await client.query(
      `UPDATE borrows 
       SET status = 'emprunte', 
           borrowed_at = CURRENT_TIMESTAMP,
           due_at = CURRENT_TIMESTAMP + INTERVAL '21 days' 
       WHERE id = $1`,
      [borrowId]
    );

    // 3. Déduction immédiate du stock de la bibliothèque
    await client.query(
      "UPDATE books SET copies_available = copies_available - 1 WHERE id = $1",
      [bookId]
    );

    await client.query("COMMIT");
    res.status(200).json({ message: `La demande pour "${title}" a été validée avec succès !` });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Erreur décision Admin :", error.message);
    res.status(400).json({ message: error.message || "Erreur lors du traitement de la demande." });
  } finally {
    client.release();
  }
};




/***   
 * Celle permet a ce que l admin lui 
 * valide le retour d un livre , apres 
 * bien evidemment un controle 
 */

 const handleReturnDecision = async (req, res) => {
  const { borrowId } = req.params; // L'ID de la ligne dans la table borrows
  const { action } = req.body;     // "accepte" ou "refuse"

  if (!["accepte", "refuse"].includes(action)) {
    return res.status(400).json({ message: "Action invalide. Choisissez 'accepte' ou 'refuse'." });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Récupération et verrouillage de la ligne (FOR UPDATE) via la colonne "id"
    const borrowCheck = await client.query(
      "SELECT book_id, status FROM borrows WHERE id = $1 FOR UPDATE",
      [borrowId]
    );

    if (!borrowCheck.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Cette demande de retour n'existe pas." });
    }

    const [{ book_id: bookId, status: currentStatus }] = borrowCheck.rows;

    console.log("Validation retour - ID Livre :", bookId, "Statut actuel :", currentStatus);


    // Sécurité : On ne peut traiter le retour que si l'étudiant l'a demandé
    if (currentStatus !== "en_attente_retour") {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Cette demande de retour a déjà été traitée." });
    }

    // ------ CAS 1 : L'ADMIN REFUSE LE RETOUR (Ex: l'étudiant n'a pas le bon livre)
    if (action === "refuse") {
      // On réinitialise return_requested_at à null et on repasse en 'emprunte'
      await client.query(
        `UPDATE borrows 
         SET status = 'emprunte', 
             return_requested_at = NULL 
         WHERE id = $1`, 
        [borrowId]
      );
      await client.query("COMMIT");
      return res.status(200).json({ message: "Retour refusé. Le livre est marqué comme toujours détenu par l'étudiant." });
    }

    // ------ CAS 2 : L'ADMIN ACCEPTE LE RETOUR (Livre posé sur le comptoir)
    
    // Mise à jour de la ligne : statut 'rendu' et enregistrement dans returned_at
    await client.query(
      `UPDATE borrows 
       SET status = 'rendu', 
           returned_at = CURRENT_TIMESTAMP 
       WHERE id = $1`,
      [borrowId]
    );

    //  MISE À JOUR DU STOCK (+1) : Le livre retourne dans les rayons de BuchVault
    await client.query(
      "UPDATE books SET copies_available = copies_available + 1 WHERE id = $1",
      [bookId]
    );

    await client.query("COMMIT");
    res.status(200).json({ message: "Le retour a été validé. Le stock du livre a été réincrémenté (+1)." });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Erreur handleReturnDecision :", error.message);
    res.status(500).json({ message: "Erreur serveur lors du traitement du retour." });
  } finally {
    client.release();
  }
};


/*** 
 * 
 * Cette fonction permet a l etudiant de faire la requete du retour 
 * d un ou de plusieurs livres 
*/
 const requestReturn = async (req, res) => {
  const { borrowIds } = req.body; // Tableau d'IDs envoyé par le front (ex: [1, 2])

  if (!Array.isArray(borrowIds) || borrowIds.length === 0) {
    return res.status(400).json({ message: "Aucun livre sélectionné pour le retour." });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Sécurité : On vérifie que ces lignes appartiennent à l'étudiant connecté et sont bien au statut 'emprunte'
    const checkQuery = `
      SELECT id FROM borrows 
      WHERE id = ANY($1) 
        AND user_id = $2 
        AND status = 'emprunte'
    `;
    const checkResult = await client.query(checkQuery, [borrowIds, req.userId]);

    // Si le nombre de lignes trouvées en BDD ne correspond pas à la sélection du front
    if (checkResult.rows.length !== borrowIds.length) {
      await client.query("ROLLBACK");
      return res.status(400).json({ 
        message: "Certains livres sélectionnés ne peuvent pas être retournés (statut incorrect ou droits insuffisants)." 
      });
    }

    // 2. Mise à jour du statut ET remplissage de ta colonne return_requested_at
    const updateQuery = `
      UPDATE borrows 
      SET status = 'en_attente_retour', 
          return_requested_at = CURRENT_TIMESTAMP 
      WHERE id = ANY($1) 
        AND user_id = $2
    `;
    await client.query(updateQuery, [borrowIds, req.userId]);

    await client.query("COMMIT");
    res.status(200).json({ 
      message: `Demande de restitution enregistrée pour ${borrowIds.length} livre(s).` 
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Erreur requestReturn :", error.message);
    res.status(500).json({ message: "Erreur interne lors de la demande de retour." });
  } finally {
    client.release();
  }
};



 const getPendingReturns = async (req, res) => {
  try {
    const query = `
      SELECT 
        b.id AS borrow_id,
        b.status,
        b.borrowed_at,
        b.return_requested_at AS requested_at, -- 🌟 On utilise la bonne colonne de demande de retour
        b.due_at,
        u.id AS user_id,
        u.first_name,
        u.last_name,
        u.email,
        bk.id AS book_id,
        bk.title,
        bk.author,
        bk.copies_available
      FROM borrows b
      JOIN users u ON b.user_id = u.id
      JOIN books bk ON b.book_id = bk.id
      WHERE b.status = 'en_attente_retour'   -- 🌟 On filtre uniquement sur les attentes de retour
      ORDER BY b.return_requested_at DESC    -- 🌟 Trié par le moment où l'étudiant a cliqué sur "Rendre"
    `;

    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Erreur récupération demandes de retour Admin :", error.message);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des demandes de retour." });
  }
};




// controleur d envoye de mail de relance pour les retards de retour
const remindStudentManual = async (req, res) => {
  const { borrowId } = req.body;

  // Validation de sécurité de l'entrée
  if (!borrowId) {
    return res.status(400).json({ message: "L'identifiant de l'emprunt (borrowId) est requis." });
  }

  try {
    // 1. Récupération des informations nécessaires à l'e-mail
    const loanQuery = await pool.query(`
      SELECT 
        b.id AS borrow_id,
        u.email,
        u.first_name || ' ' || u.last_name AS student_name,
        bk.title AS book_title,
        b.due_at,
        b.last_reminded_at
      FROM borrows b
      JOIN users u ON b.user_id = u.id
      JOIN books bk ON b.book_id = bk.id
      WHERE b.id = $1 AND b.status = 'emprunte'
    `, [borrowId]);

    if (loanQuery.rows.length === 0) {
      return res.status(404).json({ 
        message: "Emprunt en retard introuvable ou déjà restitué." 
      });
    }

    const loan = loanQuery.rows[0];

    // 2. Sécurité anti-spam : Vérification de la règle des 24 heures
    if (loan.last_reminded_at) {
      const hoursSinceLastReminder = (new Date() - new Date(loan.last_reminded_at)) / (1000 * 60 * 60);
      if (hoursSinceLastReminder < 24) {
        return res.status(429).json({ 
          message: "Une relance a déjà été envoyée à cet étudiant il y a moins de 24 heures." 
        });
      }
    }

    // 3. Formatage de la date pour le modèle de mail HTML
    const formattedDueDate = new Date(loan.due_at).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    // 4. Envoi effectif de l'e-mail via le service SMTP
    await sendOverdueReminder(loan.email, loan.student_name, loan.book_title, formattedDueDate);

    // 5. Mise à jour de l'horodatage en base de données
    await pool.query(`
      UPDATE borrows 
      SET last_reminded_at = CURRENT_TIMESTAMP 
      WHERE id = $1
    `, [borrowId]);

    return res.status(200).json({ 
      message: "L'e-mail de relance a été envoyé avec succès.",
      lastRemindedAt: new Date()
    });

  } catch (error) {
    console.error("Erreur dans le contrôleur de relance manuelle :", error);
    return res.status(500).json({ 
      message: "Une erreur technique est survenue lors de l'envoi de la relance." 
    });
  }
};

module.exports = { 
  getPendingBorrows, 
  validateCartEmprunt,
  getPendingReturns,
  handleBorrowDecision,
  requestReturn,
  handleReturnDecision,
  remindStudentManual,
};