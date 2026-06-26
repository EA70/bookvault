const express = require("express");
const router = express.Router();
const { alleUsers, getDashboardKPIs, getDashboardChartsData, getDashboardActionLists, getDashboardQuickActivity, getPendingReservations, acceptReservation, rejectReservation, getDashboardStockAlerts, getBorrowsHistory, getAllActiveLoans, getAllOverdueLoans } = require("../controllers/adminController");
const { verifyUserOrAdmin, verifyAdmin } = require("../middlewares/auth");
const {remindStudentManual}  = require("../controllers/borrowController");


/**  
 * La route qui mene a la liste de tous les utilisateurs du site 
 * ou meme de l appli
*/
router.get("/all-users",  verifyAdmin ,alleUsers );



/**  
 * Fonction qui renvoie tous les utilisateurs 
 * Total livres dans le catalogue
 * Emprunts en cours
 * Retours en retard 
 * Étudiants inscrits
 * 
*/
router.get("/dashboard/kpis",  verifyAdmin , getDashboardKPIs );


/*****
 * 
 * 
 * 
 * Graphiques
 * 
 */
router.get("/dashboard/graphics",  verifyAdmin , getDashboardChartsData );



/****
 * Emprunts recents 
 * et retours en retard 
 */

router.get("/dashboard/actions",  verifyAdmin , getDashboardActionLists );


/***
 * Les l
 *  */
router.get("/dashboard/quick-activity",  verifyAdmin , getDashboardQuickActivity );



/**** BLoc 5  */
router.get("/dashboard/pending", verifyAdmin, getPendingReservations);
router.put("/dashboard/pending/:id/accept", verifyAdmin, acceptReservation);
router.put("/dashboard/pending/:id/reject", verifyAdmin, rejectReservation);


/***
 * Bloc 6
 */

router.get("/dashboard/stock-alerts", verifyAdmin, getDashboardStockAlerts);


/**
 *  route des t
 */
router.get("/borrows/history/", verifyAdmin, getBorrowsHistory);


router.get("/loans/active", verifyAdmin, getAllActiveLoans);
router.get("/loans/overdue", verifyAdmin, getAllOverdueLoans);


// lien d envoi de mail de relance pour le retard de depot des livres
router.post("/remind",verifyAdmin, remindStudentManual);




module.exports = router;