const bcrypt = require("bcrypt");
const pool = require("../config/connexionDB");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
const { sendVerificationEmail, sendResetPasswordEmail } = require("../middlewares/emailService");
const sendEmail = require("../middlewares/emailService");


/**  
 * Enregistrement de l utilisateur, avec de validation baser backend 
 * pour ne pas enregistrer n importe quoi , 
 * ie chaine de caracteres etc..
*/
const register = async (req, res) => {
  // 1. Validation des champs du formulaire (Express Validator)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }

  const { first_name, last_name, email, password } = req.body;
  try {
    // 2. Vérification si l'email existe déjà
    const query = "SELECT * FROM users WHERE email = $1";
    const verificationEmail = await pool.query(query, [email]);
    if (verificationEmail.rows.length > 0) {
      return res.status(400).json({ message: "Cet Email est deja existant." });
    }

    /** **
     *  3. Hachage du mot de passe (10 rounds de salage)
     * Rappelons qu on pas utilise de salt sur le mot de passe crypte
     * */
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Confirmation par email (Génération des jetons)
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Le lien expire dans 24h

    // 5. Insertion en base de données avec is_verified = FALSE, le token et son expiration
    const insertQuery = `
      INSERT INTO users (first_name, last_name, email, password, role, is_verified, verification_token, token_expires_at) 
      VALUES ($1, $2, $3, $4, 'student', FALSE, $5, $6) 
      RETURNING id, first_name, last_name, email, role
    `;
    const newUser = await pool.query(insertQuery, [first_name, last_name, email, hashedPassword, token, expiresAt]);
    const student = newUser.rows[0];
    

    // 6. Déclenchement de l'envoi de l'email en tâche de fond
      try {
        await sendVerificationEmail(student.email, student.first_name, token);
      } catch (mailError) {
        // On log l'erreur du mail mais on ne bloque pas la réponse client, 
        // pour éviter de crash si le serveur de mail a un micro-coupure
        console.error("Erreur lors de l'envoi du mail de confirmation :", mailError.message);
      }

    // 7. Réponse de succès mise à jour
    res.status(201).json({
      success: true,
      message: "Utilisateur enregistré avec succès ! Un email de confirmation vous a été envoyé pour activer votre compte.",
    });

  } catch (error) {
    console.error("Cause de l erreur : ", error.message);
    res.status(500).json({
      success: false,
      message: "Erreur du Serveur lors de la creation du compte",
    });
  }
};


/**  
 * Vérification de l'email de l'utilisateur
 */
const verifyEmail = async (req, res) => {
  // On récupère le token depuis l'URL (ex: /verify-email?token=abc123)
  const { token } = req.query;

  if (!token) { return res.status(400).send("Jeton de vérification manquant."); }

  try {
    // 1. On cherche l'utilisateur qui possède ce token
    const textQuery = `SELECT id, token_expires_at FROM users WHERE verification_token = $1`;
    const userQuery = await pool.query(textQuery,[token]);

    if (userQuery.rows.length === 0) {
      // Si aucun token ne correspond en BDD
      return res.status(400).send("Ce lien de vérification est invalide ou a déjà été utilisé.");
    }
    const user = userQuery.rows[0];

    // 2. On vérifie si le token n'a pas expiré
    if (new Date() > new Date(user.token_expires_at)) {
      return res.status(400).send("Ce lien a expiré (validité de 24h). Veuillez vous réinscrire ou demander un nouveau lien.");
    }

    // 3. Le token est valide ! On active le compte et on nettoie les colonnes temporaires
    await pool.query(
      `UPDATE users 
       SET is_verified = TRUE, verification_token = NULL, token_expires_at = NULL 
       WHERE id = $1`,
      [user.id]
    );

    // 4. Redirection automatique de l'étudiant vers l interface Frontend (page de Login)
    // On ajoute un paramètre de succès (?verified=true) pour le frontend!
    res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);

  } catch (error) {
    console.error("Erreur dans verifyEmail:", error);
    res.status(500).send("Une erreur technique est survenue lors de la validation de votre compte.");
  }
};



/**  
 * La login pour se connecter a l appli 
*/
const login = async (req, res) => {
  // 1. Validation des champs du formulaire (Express Validator)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    // 2. Recherche de l'utilisateur en Base de Données
    const queryText = "SELECT * FROM users WHERE email = $1";
    const userResult = await pool.query(queryText, [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Identifiants invalides." });
    }
    const user = userResult.rows[0];
    // 3. Sécurité : Vérifier si le compte est suspendu par l'admin
    if (user.is_blocked) {
      return res.status(403).json({ message: "Votre compte a été suspendu par l'administration." });
    }

    // 4. SÉCURITÉ : Vérifier si l'email a été validé par l'étudiant
    if (!user.is_verified) {
      return res.status(403).json({ 
        message: "Votre compte n'est pas encore actif. Veuillez cliquer sur le lien envoyé dans votre boîte mail pour l'activer." 
      });
    }

    // 5. Vérification du mot de passe (bcrypt)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Identifiants invalides." });
    }

    // 6. Gestion de la session en BDD
    const sessionRef = crypto.randomBytes(16).toString("hex");
    const updateSessionQuery = "UPDATE users SET session_reference = $1 WHERE id = $2";
    await pool.query(updateSessionQuery, [sessionRef, user.id]);

    // 7. Génération du Token JWT selon le rôle
    let token;
    if (user.role === "admin") {
      token = jwt.sign(
        { 
          userId: user.id,          
          role: user.role,       
          session_ref: sessionRef 
        },
        process.env.JWT_SECRET_ADMIN,  
        { expiresIn: "3h" }
      );
    } else {
      token = jwt.sign(
        { 
          userId: user.id,          
          role: user.role,          
          session_ref: sessionRef 
        },
        process.env.JWT_SECRET_USER,   
        { expiresIn: "3h" }
      );
    }

    // 8. Réponse finale envoyée au Frontend
    res.json({
      message: "Connexion reussie !",
      token: token
    });

  } catch (error) {
    console.error("Erreur lors de la connexion :", error.message);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de l'authentification." });
  }
};




/**  
 * La fonction pour réinitialiser le mot de passe
 */
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const userResult = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0) {
      // Pour des raisons de sécurité, on évite de dire "Cet email n'existe pas" 
      // pour ne pas aider les hackers à deviner les emails inscrits.
      return res.json({ message: "Si cet email existe, un lien de réinitialisation a été envoyé." });
    }

    const userId = userResult.rows[0].id;

    // Générer un token sécurisé et une date d'expiration (Valable 1 heure)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000); // Maintenant + 1h

    // Sauvegarder en Base de Données
    await pool.query(
      "UPDATE users SET reset_password_token = $1, reset_password_expires_at = $2 WHERE id = $3",
      [resetToken, expiresAt, userId]
    );

    // Créer le lien vers ton FRONTEND React
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Envoyer le mail (Adapte selon les paramètres de ton emailService)
    await sendResetPasswordEmail(email, resetLink);

    res.json({ message: "Si cet email existe, un lien de réinitialisation a été envoyé." });

  } catch (error) {
    console.error("Erreur forgotPassword:", error);
    res.status(500).json({ message: "Erreur serveur lors de la demande..." });
  }
};

/***
 * La fonction pour réinitialiser le mot de passe après que l'étudiant clique sur le lien dans son mail
 */
const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    // Chercher l'utilisateur avec ce token ET vérifier que la date d'expiration est dans le futur
    const queryText = `
      SELECT id FROM users 
      WHERE reset_password_token = $1 AND reset_password_expires_at > NOW()
    `;
    const userResult = await pool.query(queryText, [token]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "Le lien est invalide ou a expiré. Veuillez refaire une demande." });
    }

    const userId = userResult.rows[0].id;

    // Hacher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Mettre à jour le mot de passe et effacer les champs de reset
    await pool.query(
      "UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expires_at = NULL WHERE id = $2",
      [hashedPassword, userId]
    );

    res.json({ message: "Votre mot de passe a été modifié avec succès ! Vous pouvez vous connecter." });

  } catch (error) {
    console.error("Erreur resetPassword:", error);
    res.status(500).json({ message: "Erreur serveur lors de la modification." });
  }
};

module.exports = { register, login, verifyEmail, forgotPassword, resetPassword };
