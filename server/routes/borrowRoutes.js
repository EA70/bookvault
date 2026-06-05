

const express = require("express");
const router = express.Router();
const { validateCartEmprunt, getPendingBorrows, handleBorrowDecision, requestReturn, handleReturnDecision, getPendingReturns } = require("../controllers/borrowController");
const { verifyUserOrAdmin, verifyAdmin } = require("../middlewares/auth");


/**
 * Le joyau qui valide la corbeille 
 * des livres pour pouvoir la requete de confirmation a 
 * l admin !!!
 */
router.post("/validate-cart", verifyUserOrAdmin, validateCartEmprunt);

/**
 * Récupérer toutes les demandes de la bibliothèque
 * les livres et les infos de la personne 
 * qui veut preter 
 * 
 */
router.get("/borrows/pending", verifyAdmin, getPendingBorrows);



/**
 * Récupérer toutes les demandes de RETOUR de la bibliothèque
 * les livres et les infos de la personne 
 * qui veut preter 
 * 
 */
router.get("/borrows/return-pending", verifyAdmin, getPendingReturns);



/**
 * Decision Admin :
 * Décider du sort d'une demande 
 * (:borrowId) -> req.body { action: 'accepte' ou 'refuse' }
 * 
 */
router.put("/borrows/:borrowId/decision", verifyAdmin, handleBorrowDecision);



/**   
 * Decision Admin sur le retour 
 * du livre ou des livres
*/
router.post("/request-return", verifyUserOrAdmin, requestReturn);




/***
 * Route Admin : Valider définitivement le retour et ajuster le stock (+1)
 * 
 */
router.put("/borrows/:borrowId/return-decision", verifyAdmin, handleReturnDecision);








module.exports = router;