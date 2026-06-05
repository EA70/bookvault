

const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }
  next(); 
};

// Regles de validation pour les champs de Inscription 
const validateRegister = [
  body("first_name")
    .trim()
    .notEmpty().withMessage("Le prénom est obligatoire.")
    .isLength({ min: 2, max: 50 }).withMessage("Le prénom doit faire entre 2 et 50 caractères.")
    .matches(/^[A-Za-zÀ-ÿ\s-]+$/).withMessage("Le prénom ne doit contenir que des lettres, espaces ou tirets."),
  
  body("last_name")
    .trim()
    .notEmpty().withMessage("Le nom est obligatoire.")
    .isLength({ min: 2, max: 50 }).withMessage("Le nom doit faire entre 2 et 50 caractères.")
    .matches(/^[A-Za-zÀ-ÿ\s-]+$/).withMessage("Le nom ne doit contenir que des lettres, espaces ou tirets."),
  
  body("email")
    .trim()
    .notEmpty().withMessage("L'email est obligatoire.")
    .isEmail().withMessage("Le format de l'adresse email est invalide.")
    .normalizeEmail(),
  
  body("password")
    .isLength({ min: 6 }).withMessage("Le mot de passe doit contenir au moins 6 caractères."),
    
  handleValidationErrors  
];

// Règles pour la connexion
const validateLogin = [
  body("email")
    .trim()
    .isEmail().withMessage("Format d'email invalide.")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("Le mot de passe est obligatoire."),
    
  handleValidationErrors  
];

module.exports = {
  validateRegister,
  validateLogin
};