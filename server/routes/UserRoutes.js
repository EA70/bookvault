const express = require("express");
const { profilUser, getUserLoans, getUserActiveQuota, getUserHistory } = require("../controllers/userController");
const { verifyUser, verifyUserOrAdmin } = require("../middlewares/auth");
const router = express.Router();

/**
 * Ce ptit bijoux lui renvoie : 
 * sert à donner au front le quota “actif” de l’étudiant, 
 * calculé depuis la BDD, pour pouvoir : 
 * savoir combien de livres il a déjà empruntés (totalBorrowed) bloquer les doublons 
 * (si l’étudiant possède déjà un livre ou a une demande en cours) via activeBookIds
 * dire si l’étudiant peut encore emprunter
 */
router.get("/users/quota", verifyUserOrAdmin, getUserActiveQuota);



/**
 * 
 * Regarde tu vas voir a cette route 
 * sert. Je dois aussi etre implicite 
 */
router.get("/me", verifyUserOrAdmin, profilUser);


/**
 * 
 * 
 * getUserLoans sert à renvoyer au front la liste 
 * des emprunts de l’utilisateur connecté (donc un étudiant), 
 * pour afficher “Mes emprunts”.
 */

router.get("/my-loans", verifyUser, getUserLoans);


/**
 * 
 * 
 * getUserLoans sert à renvoyer au front la liste 
 * des emprunts de l’utilisateur connecté (donc un étudiant), 
 * pour afficher “Mes emprunts”.
 */

router.get("/my-history", verifyUser, getUserHistory);



module.exports = router;