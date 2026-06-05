
const pool = require("../config/connexionDB");



/** 
 * Va lire dans son route Controller :
 * tu trouveras le detail
*/
const profilUser = async (req, res) => {
  try {
    const queryText = `
      SELECT first_name, last_name, email, role, is_blocked 
      FROM users 
      WHERE session_reference = $1
    `;
    
    const result = await pool.query(queryText, [req.sessionRef]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Session introuvable." });
    }

    const user = result.rows[0];

    // Sécurité de dernière minute : Si l'admin vient de bloquer cet user, on lui coupe l'accès immédiatement
    if (user.is_blocked) {
      return res.status(403).json({ message: "Compte suspendu." });
    }

    return res.status(200).json({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role 
    });

  } catch (error) {
    console.error("Erreur sur la route /me :", error.message);
    return res.status(500).json({ message: "Erreur serveur lors de la récupération du profil." });
  }
};


/**
 * la gentille fonction Backend qui 
 *  doit fournir les emprunts actifs 
 * de l'utilisateur
 * 
 */

 const getUserActiveQuota = async (req, res) => {
  const { sessionRef } = req;

  try {
    // 1. Récupérer l'ID de l'utilisateur
    const userCheck = await pool.query(
      "SELECT id FROM users WHERE session_reference = $1",
      [sessionRef]
    );

    if (!userCheck.rows.length) {
      return res.status(401).json({ message: "Session invalide." });
    }

    const [{ id: userId }] = userCheck.rows;

    // 2. Compter ses emprunts actifs ET ses réservations en attente
    const countCheck = await pool.query(
      "SELECT COUNT(*) FROM borrows WHERE user_id = $1 AND status IN ('emprunte', 'en_attente_remise')",
      [userId]
    );
    const totalBorrowed = parseInt(countCheck.rows[0].count, 10);

    // 3. Récupérer les IDs des livres qu'il possède déjà pour bloquer les doublons
    const booksCheck = await pool.query(
      "SELECT book_id FROM borrows WHERE user_id = $1 AND status IN ('emprunte', 'en_attente_remise')",
      [userId]
    );
    const activeBookIds = booksCheck.rows.map(({ book_id }) => book_id);

    res.status(200).json({
      totalBorrowed,
      activeBookIds,
      canBorrow: totalBorrowed < 3
    });

  } catch (error) {
    console.error("Erreur quota :", error.message);
    res.status(500).json({ message: "Erreur serveur lors de la vérification du quota." });
  }
};



/**
 * Ce joyau nous renvoie les livres que 
 * l utilisateur a pris ou preter
 */

 const getUserLoans = async (req, res) => {
  const { sessionRef } = req; // Récupéré depuis ton middleware d'authentification

  try {
    const userCheck = await pool.query(
      "SELECT id FROM users WHERE session_reference = $1",
      [sessionRef]
    );

    if (!userCheck.rows.length) {
      return res.status(401).json({ message: "Session invalide ou expirée." });
    }

    const userId = userCheck.rows[0].id;

    // Récupérer les emprunts en cours ('emprunte') et ceux en attente de dépôt ('en_attente_retour')
    const loansQuery = await pool.query(
      `SELECT 
        b.id AS borrow_id, 
        b.status, 
        b.borrowed_at,
        b.return_requested_at,
        b.returned_at,
        b.due_at,
        bk.title, 
        bk.author
       FROM borrows b
       JOIN books bk ON b.book_id = bk.id
       WHERE b.user_id = $1 AND b.status IN ('emprunte', 'en_attente_remise', 'en_attente_retour')
       ORDER BY b.borrowed_at DESC`,
      [userId]
    );

    res.status(200).json(loansQuery.rows);
  } catch (error) {
    console.error("Erreur getUserLoans:", error);
    res.status(500).json({ message: "Erreur lors de la récupération de vos emprunts." });
  }
};




/**
 * Ce joyau nous renvoie l historique 
 * de prets de l utisateur 
 */

 const getUserHistory = async (req, res) => {
  const { sessionRef } = req;

  try {
    const userCheck = await pool.query(
      "SELECT id FROM users WHERE session_reference = $1",
      [sessionRef]
    );

    if (!userCheck.rows.length) {
      return res.status(401).json({ message: "Session invalide ou expirée." });
    }

    const userId = userCheck.rows[0].id;

    // 2. Récupérer TOUTES les lignes de cet utilisateur
    const historyQuery = await pool.query(
      `SELECT 
        b.id AS borrow_id, 
        b.status, 
        b.borrowed_at,
        b.due_at,
        b.return_requested_at,
        b.returned_at,
        bk.title, 
        bk.author
       FROM borrows b
       JOIN books bk ON b.book_id = bk.id
       WHERE b.user_id = $1
       ORDER BY COALESCE(b.returned_at, b.borrowed_at) ASC`, // Trie par ordre chronologique des derniers événements
      [userId]
    );

    res.status(200).json(historyQuery.rows);
  } catch (error) {
    console.error("Erreur getUserHistory:", error);
    res.status(500).json({ message: "Erreur lors de la récupération de l'historique." });
  }
};




module.exports = {profilUser, getUserActiveQuota, getUserLoans, getUserHistory};