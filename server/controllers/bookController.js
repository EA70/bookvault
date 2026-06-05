const pool = require("../config/connexionDB");


/** 
 * Recuperer les livres au hasard 
 * (Accessible par tout le monde, utile pour l'accueil)
 * */ 
const getRandomBooks = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT books.id, books.title, books.author, books.description, 
              books.published_year, books.copies_available, books.total_copies, 
              books.cover_image, categories.name AS category_name
       FROM books
       LEFT JOIN categories ON books.category_id = categories.id
       ORDER BY RANDOM()
       LIMIT 6`
    );
    
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Erreur dans getRandomBooks :", err.message);
    res.status(500).json({ message: "Erreur serveur lors de la recuperation des livres,,,," });
  }
};


/**
 * Cette route est utilise pour envoyer tous les catalogues
 * du livre au frontEnd 
 */
const getAllBooks = async (req, res) => {
  try {
    // On fait un LEFT JOIN pour récupérer le nom de la catégorie en même temps !
    const result = await pool.query(`
      SELECT books.*, categories.name AS category_name 
      FROM books 
      LEFT JOIN categories ON books.category_id = categories.id
      ORDER BY books.title ASC
    `);
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erreur getAllBooks:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des livres." });
  }
}; 







// 3. AJOUTER UN LIVRE (ADMIN)---------------------------------------------------------- A REVOIR

const addBook = async (req, res) => {
  const { 
    title, 
    author, 
    description, 
    published_year, 
    total_copies, 
    category_id 
  } = req.body;

  if (!title || !author) {
    return res.status(400).json({
      message: "Le titre et l'auteur sont obligatoires."
    });
  }

  try {

    // Génération automatique de l'image de couverture
    const formattedTitle = title.replace(/\s+/g, "");
    const cover_image = `https://picsum.photos/seed/${formattedTitle}/300/400`;

    // Génération automatique ISBN
    const generateISBN = () => {
      const prefix = "978";

      const randomNumbers = Math.floor(
        1000000000 + Math.random() * 9000000000
      );

      return `${prefix}-${randomNumbers}`;
    };
    const isbn = generateISBN();
    const copies_available = total_copies || 1;

    const queryText = `
      INSERT INTO books (
        title,
        author,
        isbn,
        description,
        published_year,
        copies_available,
        total_copies,
        category_id,
        cover_image
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const result = await pool.query(queryText, [
      title,
      author,
      isbn,
      description,
      published_year,
      copies_available,
      total_copies || 1,
      category_id,
      cover_image
    ]);

    res.status(201).json({
      message: "Livre ajouté avec succès !",
      book: result.rows[0]
    });

  } catch (err) {
    console.error("Erreur dans addBook :", err.message);

    res.status(500).json({
      message: "Erreur serveur lors de l'ajout du livre."
    });
  }
};




/**
 * 4. MODIFIER UN LIVRE (ADMIN)
 */
const updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, isbn, description, published_year, total_copies, copies_available, category_id } = req.body;

  try {
    // On verifie si le livre existe
    const bookCheck = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
    if (bookCheck.rows.length === 0) {
      return res.status(404).json({ message: "Livre introuvable." });
    }

    // Si le titre change, on met aussi a jour la couverture automatiquement
    let cover_image = bookCheck.rows[0].cover_image;
    if (title && title !== bookCheck.rows[0].title) {
      const formattedTitle = title.replace(/\s+/g, "");
      cover_image = `https://picsum.photos/seed/${formattedTitle}/300/400`;
    }

    const result = await pool.query(
      `UPDATE books 
       SET title = COALESCE($1, title), 
           author = COALESCE($2, author), 
           isbn = COALESCE($3, isbn), 
           description = COALESCE($4, description), 
           published_year = COALESCE($5, published_year), 
           total_copies = COALESCE($6, total_copies), 
           copies_available = COALESCE($7, copies_available), 
           category_id = COALESCE($8, category_id),
           cover_image = $9
       WHERE id = $10
       RETURNING *`,
      [title, author, isbn, description, published_year, total_copies, copies_available, category_id, cover_image, id]
    );

    res.status(200).json({ message: "Livre mis a jour avec succes !", book: result.rows[0] });
  } catch (err) {
    console.error("Erreur dans updateBook :", err.message);
    res.status(500).json({ message: "Erreur serveur lors de la modification du livre." });
  }
};



// 5. SUPPRIMER UN LIVRE (ADMIN)
const deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM books WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Livre introuvable, impossible de le supprimer." });
    }

    res.status(200).json({ message: "Livre supprime du catalogue avec succes." });
  } catch (err) {
    console.error("Erreur dans deleteBook :", err.message);
    res.status(500).json({ message: "Erreur serveur lors de la suppression du livre." });
  }
};

// TOus les livres sans exception




module.exports = { addBook, deleteBook, updateBook, getRandomBooks, getAllBooks };