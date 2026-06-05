 
const pool = require("../config/connexionDB");


/**
 * Dois je aussi ecrire ici un commentaire ? tu es dev mon ami 
 * donc comprends 
 */
const getAllCategories = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories ORDER BY name ASC");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erreur getAllCategories:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des catégories." });
  }
};

module.exports = { getAllCategories };