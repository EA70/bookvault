const pool = require("../config/connexionDB");

/**
 * Fonction qui renvoie tous les utilisateurs a l admin
 */
const alleUsers = async (req, res) => {
  try {
    const studentsResult = await pool.query(`
      SELECT id, first_name, last_name, email, role, created_at 
      FROM users 
      WHERE role = 'student'
      ORDER BY first_name ASC
    `);

    res.status(200).json({
      students: studentsResult.rows,
    });
  } catch (error) {
    console.error("Erreur Dashboard Admin : " + error.message);
    res
      .status(500)
      .json({ message: "Erreur du serveur lors du chargement du dashboard" });
  }
};

/**
 * Fonction qui renvoie tous les utilisateurs
 * Total livres dans le catalogue
 * Emprunts en cours
 * Retours en retard
 * Étudiants inscrits
 *
 */
const getDashboardKPIs = async (req, res) => {
  try {
    // Une seule requête SQL magique pour calculer les 4 indicateurs d'un coup
    const kpiQuery = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM books) AS total_books,
        (SELECT COUNT(*) FROM borrows WHERE status = 'emprunte') AS active_loans,
        (SELECT COUNT(*) FROM borrows WHERE status = 'emprunte' AND due_at < CURRENT_TIMESTAMP) AS overdue_returns,
        (SELECT COUNT(*) FROM users WHERE role = 'student') AS total_students
    `);

    const kpis = {
      totalBooks: parseInt(kpiQuery.rows[0].total_books, 10),
      activeLoans: parseInt(kpiQuery.rows[0].active_loans, 10),
      overdueReturns: parseInt(kpiQuery.rows[0].overdue_returns, 10),
      totalStudents: parseInt(kpiQuery.rows[0].total_students, 10),
    };

    res.status(200).json(kpis);
  } catch (error) {
    console.error("Erreur getDashboardKPIs:", error);
    res
      .status(500)
      .json({
        message: "Erreur lors du calcul des indicateurs du tableau de bord.",
      });
  }
};

/**
 *
 *
 * Les Graphiques de l Admin
 *
 *
 */

const getDashboardChartsData = async (req, res) => {
  try {
    // 📊 REQUÊTE 1 : Emprunts des 6 derniers mois (Inchangée et validée)
    const monthlyLoansQuery = await pool.query(`
      SELECT 
        TO_CHAR(m.month, 'Mon YYYY') AS month_label,
        COUNT(b.id) AS loan_count
      FROM (
        SELECT GENERATE_SERIES(CURRENT_DATE - INTERVAL '5 months', CURRENT_DATE, '1 month') AS month
      ) m
      LEFT JOIN borrows b ON TO_CHAR(b.borrowed_at, 'YYYY-MM') = TO_CHAR(m.month, 'YYYY-MM')
                         AND b.status IN ('emprunte', 'rendu', 'en_attente_retour')
      GROUP BY m.month
      ORDER BY m.month ASC
    `);

    //  REQUÊTE 2 : Répartition des livres par catégorie (Avec jointure sur la table categories)
    const categoryQuery = await pool.query(`
      SELECT 
        COALESCE(c.name, 'Non spécifié') AS category_name,
        COUNT(b.id) AS value
      FROM borrows b
      JOIN books bk ON b.book_id = bk.id
      LEFT JOIN categories c ON bk.category_id = c.id -- Jointure pour lier le category_id au "name" de la catégorie
      WHERE b.status IN ('emprunte', 'rendu', 'en_attente_retour')
      GROUP BY c.name, bk.category_id --  Groupement obligatoire sur le nom et l'ID d'origine
      ORDER BY value DESC
      LIMIT 6
    `);

    res.status(200).json({
      monthlyLoans: monthlyLoansQuery.rows,
      categoryDistribution: categoryQuery.rows,
    });
  } catch (error) {
    console.error("Erreur getDashboardChartsData:", error);
    res.status(500).json({ message: "Erreur lors du calcul des graphiques." });
  }
};

/****
 * Emprunts recents
 * et retours en retard
 */

const getDashboardActionLists = async (req, res) => {
  try {
    //  LISTE 1 : Les 5 emprunts les plus récents
    const recentLoansQuery = await pool.query(`
      SELECT 
        b.id,
        u.first_name || ' ' || u.last_name AS student_name,
        bk.title AS book_title,
        b.due_at,
        b.status
      FROM borrows b
      JOIN users u ON b.user_id = u.id
      JOIN books bk ON b.book_id = bk.id
      ORDER BY b.borrowed_at DESC
      LIMIT 7
    `);

    //  LISTE 2 : Les retours en retard (Urgent)
    // On calcule dynamiquement le nombre de jours de retard avec CURRENT_TIMESTAMP
    const overdueLoansQuery = await pool.query(`
      SELECT 
        b.id,
        u.first_name || ' ' || u.last_name AS student_name,
        bk.title AS book_title,
        EXTRACT(DAY FROM (CURRENT_TIMESTAMP - b.due_at)) AS days_overdue
      FROM borrows b
      JOIN users u ON b.user_id = u.id
      JOIN books bk ON b.book_id = bk.id
      WHERE b.status = 'emprunte' AND b.due_at < CURRENT_TIMESTAMP
      ORDER BY days_overdue DESC
    `);

    res.status(200).json({
      recentLoans: recentLoansQuery.rows,
      overdueLoans: overdueLoansQuery.rows.map((row) => ({
        ...row,
        days_overdue: Math.floor(row.days_overdue), // On s'assure d'avoir un entier propre
      })),
    });
  } catch (error) {
    console.error("Erreur getDashboardActionLists:", error);
    res
      .status(500)
      .json({ message: "Erreur lors du chargement des listes d'action." });
  }
};

/***
 * fonction qui
 *  */
const getDashboardQuickActivity = async (req, res) => {
  try {
    //  1. Les 5 livres les plus empruntés de tous les temps (Top Tendances)
    const topBooksQuery = await pool.query(`
      SELECT 
        bk.id,
        bk.title,
        bk.author,
        bk.cover_image,
        COUNT(b.id) AS borrow_count
      FROM borrows b
      JOIN books bk ON b.book_id = bk.id
      GROUP BY bk.id, bk.title, bk.author, bk.cover_image
      ORDER BY borrow_count DESC
      LIMIT 5
    `);

    //  2. Les 5 derniers étudiants inscrits (Comptes récents)
    const recentStudentsQuery = await pool.query(`
      SELECT 
        id,
        first_name,
        last_name,
        email,
        created_at
      FROM users
      WHERE role = 'student' -- Ou selon comment tu distingues tes étudiants dans ta table users
      ORDER BY created_at DESC
      LIMIT 5
    `);

    res.status(200).json({
      topBooks: topBooksQuery.rows,
      recentStudents: recentStudentsQuery.rows,
    });
  } catch (error) {
    console.error("Erreur getDashboardQuickActivity:", error);
    res
      .status(500)
      .json({ message: "Erreur lors du chargement de l'activité rapide." });
  }
};

/***
 * Accepter Reservation admin
 *
 *
 */
//  Récupérer les demandes en attente
const getPendingReservations = async (req, res) => {
  try {
    const query = await pool.query(`
      SELECT 
        b.id,
        u.first_name || ' ' || u.last_name AS student_name,
        bk.title AS book_title,
        bk.copies_available,
        b.borrowed_at AS request_date
      FROM borrows b
      JOIN users u ON b.user_id = u.id
      JOIN books bk ON b.book_id = bk.id
      WHERE b.status = 'en_attente_remise' -- Ajuste selon ton statut exact en BDD
      ORDER BY b.borrowed_at ASC
    `);
    res.status(200).json(query.rows);
  } catch (error) {
    console.error("Erreur getPendingReservations:", error);
    res
      .status(500)
      .json({ message: "Erreur lors du chargement des demandes." });
  }
};

// Accepter une demande (Passe en emprunté et décrémente le stock si pas déjà fait)
const acceptReservation = async (req, res) => {
  const { id } = req.params;
  try {
    // 1. Mettre à jour le statut de l'emprunt et fixer les dates officielles
    // On définit la date limite (due_at) à +14 jours par exemple
    await pool.query(
      `
      UPDATE borrows 
      SET 
        status = 'emprunte', 
        borrowed_at = CURRENT_TIMESTAMP,
        due_at = CURRENT_TIMESTAMP + INTERVAL '14 days'
      WHERE id = $1
    `,
      [id],
    );

    res.status(200).json({ message: "L'emprunt a été validé avec succès." });
  } catch (error) {
    console.error("Erreur acceptReservation:", error);
    res.status(500).json({ message: "Erreur lors de la validation." });
  }
};

//  Refuser une demande
const rejectReservation = async (req, res) => {
  const { id } = req.params;
  try {
    // On peut soit supprimer la ligne, soit la passer en statut 'refuse'
    await pool.query(
      `
      UPDATE borrows 
      SET status = 'refuse' 
      WHERE id = $1
    `,
      [id],
    );

    res.status(200).json({ message: "La demande a été refusée." });
  } catch (error) {
    console.error("Erreur rejectReservation:", error);
    res.status(500).json({ message: "Erreur lors du refus." });
  }
};

/***
 * Récupérer les alertes de stock du tableau de bord
 *
 *
 */
const getDashboardStockAlerts = async (req, res) => {
  try {
    // 1. Livres en rupture totale de stock (Indisponibles pour les étudiants)
    const stockOutQuery = await pool.query(`
      SELECT 
        id,
        title,
        author,
        total_copies
      FROM books
      WHERE copies_available = 0
      ORDER BY total_copies DESC
      LIMIT 5
    `);

    // 2. Alerte de Stock Critique (Livres très demandés qui n'ont plus qu'un seul exemplaire restant)
    const criticalStockQuery = await pool.query(`
      SELECT 
        id,
        title,
        author,
        copies_available,
        total_copies
      FROM books
      WHERE copies_available = 1 AND total_copies > 1
      ORDER BY total_copies DESC
      LIMIT 5
    `);

    res.status(200).json({
      stockOut: stockOutQuery.rows,
      criticalStock: criticalStockQuery.rows,
    });
  } catch (error) {
    console.error("Erreur getDashboardStockAlerts:", error);
    res
      .status(500)
      .json({ message: "Erreur lors du calcul des alertes de stock." });
  }
};

/**
 * Récupérer l'historique complet des emprunts pour l'administration
 * GET /api/borrows/history
 * Optionnel : Query param ?studentId=X
 */
const getBorrowsHistory = async (req, res) => {
  // Récupération d'un éventuel filtre par étudiant depuis l'URL (?studentId=12)
  const { studentId } = req.query;

  try {
    let queryText = `
      SELECT 
        b.id AS borrow_id,
        b.status,               -- Ex: 'borrowed', 'returned', 'return_requested'
        b.borrowed_at,          -- Date de l'emprunt
        b.due_at,               -- Date limite de rendu
        b.return_requested_at,  -- Date de demande de retour par l'étudiant
        b.returned_at,          -- Date de validation réelle du retour par l'admin
        u.id AS student_id,
        u.first_name || ' ' || u.last_name AS student_name,
        u.email AS student_email,
        bk.id AS book_id,
        bk.title AS book_title,
        bk.author AS book_author
      FROM borrows b
      JOIN users u ON b.user_id = u.id
      JOIN books bk ON b.book_id = bk.id
    `;

    const queryParams = [];

    // Si l'admin veut filtrer l'historique d'un étudiant en particulier
    if (studentId) {
      queryText += ` WHERE u.id = $1`;
      queryParams.push(studentId);
    }

    // On classe du plus récent emprunt au plus ancien
    queryText += ` ORDER BY b.borrowed_at DESC`;

    const result = await pool.query(queryText, queryParams);

    res.json({
      success: true,
      count: result.rows.length,
      history: result.rows,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique :", error);
    res.status(500).json({
      success: false,
      message:
        "Erreur serveur lors de la récupération de l'historique des emprunts.",
    });
  }
};



/**
 * Récupère tous les emprunts actifs ou en attente.
 * Route : GET /api/loans/active
 */
const getAllActiveLoans = async (req, res) => {
  try {
    const query = `
      SELECT 
        b.id AS borrow_id,
        u.id AS user_id,
        u.first_name || ' ' || u.last_name AS student_name,
        bk.id AS book_id,
        bk.title AS book_title,
        b.borrowed_at,
        b.due_at,
        b.return_requested_at,
        b.status
      FROM borrows b
      JOIN users u ON b.user_id = u.id
      JOIN books bk ON b.book_id = bk.id
      WHERE b.status IN ('en_attente_remise', 'emprunte', 'en_attente_retour')
      ORDER BY b.borrowed_at DESC
    `;
    
    const { rows } = await pool.query(query);
    
    // 'res' est utilisé ici pour renvoyer les données au format JSON avec un statut 200 (OK)
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des emprunts actifs :", error);
    
    // 'res' renvoie une erreur 500 au client en cas de problème serveur
    return res.status(500).json({ 
      message: "Une erreur est survenue lors de la récupération des emprunts actifs." 
    });
  }
};

/**
 * Récupère tous les emprunts en retard de restitution.
 * Route : GET /api/loans/overdue
 */
const getAllOverdueLoans = async (req, res) => {
  try {
    const query = `
      SELECT 
        b.id AS borrow_id,
        u.id AS user_id,
        u.first_name || ' ' || u.last_name AS student_name,
        bk.id AS book_id,
        bk.title AS book_title,
        b.borrowed_at,
        b.due_at,
        b.last_reminded_at,
        EXTRACT(DAY FROM (CURRENT_TIMESTAMP - b.due_at)) AS days_overdue
      FROM borrows b
      JOIN users u ON b.user_id = u.id
      JOIN books bk ON b.book_id = bk.id
      WHERE b.status = 'emprunte' 
        AND b.due_at < CURRENT_TIMESTAMP
      ORDER BY days_overdue DESC
    `;
    
    const { rows } = await pool.query(query);
    
    // 'res' renvoie la liste des retards au frontend
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des emprunts en retard :", error);
    
    return res.status(500).json({ 
      message: "Une erreur est survenue lors de la récupération des emprunts en retard." 
    });
  }
};


module.exports = {
  alleUsers,
  getDashboardKPIs,
  getDashboardChartsData,
  getDashboardActionLists,
  getDashboardQuickActivity,
  getBorrowsHistory,
  getPendingReservations,
  acceptReservation,
  rejectReservation,
  getDashboardStockAlerts,
  getAllActiveLoans,
  getAllOverdueLoans
};
