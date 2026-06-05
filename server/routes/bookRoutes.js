const express = require("express");
const router = express.Router();
const { getRandomBooks, getAllBooks } = require("../controllers/bookController");

const { verifyUserOrAdmin } = require("../middlewares/auth");




/** 
 * Recuperer les livres au hasard 
 * (Accessible par tout le monde, utile pour l'accueil)
 * */ 
router.get("/books/random", getRandomBooks);

/**
 * Cette route est utilise pour envoyer tous les catalogues
 * du livre au frontEnd 
 */
router.get("/books",verifyUserOrAdmin, getAllBooks);


 


module.exports = router;