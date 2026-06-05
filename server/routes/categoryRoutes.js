

const express = require("express");
const router = express.Router();
const { getAllCategories } = require("../controllers/categoryController");
const { verifyUserOrAdmin } = require("../middlewares/auth");


/**
 * Dois je aussi ecrire ici un commentaire ? tu es dev mon ami 
 * donc comprends 
 */
router.get("/", verifyUserOrAdmin , getAllCategories);

module.exports = router;