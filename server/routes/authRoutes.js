const express = require("express");
const router = express.Router();
const { register, login, verifyEmail, resetPassword, forgotPassword } = require("../controllers/authController");
const { ipLimiter, emailLimiter } = require("../middlewares/rateLimiters") 
const {validateRegister, validateLogin}= require("../middlewares/validation")


/**   
 * Les routes d authentification !
 * Pas d explication 
 * Tout est clair 
*/
router.post("/register", ipLimiter, emailLimiter, validateRegister, register);
router.post("/login", ipLimiter, emailLimiter, validateLogin, login);
router.get("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;