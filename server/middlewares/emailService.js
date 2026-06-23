const nodemailer = require("nodemailer");

// On crée le transporteur qui va se connecter à ta boîte mail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Fonction pour envoyer le mail de validation à l'étudiant
 */
 const sendVerificationEmail = async (studentEmail, studentName, token) => {
  // Le lien de la verifcation contient le token unique qui permettra d'identifier l'utilisateur et de valider son compte
  const verificationLink = `${process.env.BACKEND_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `BuchVault - Votre bibliothèque numérique" <${process.env.EMAIL_USER}>`,
    to: studentEmail,
    subject: "Activer votre compte BuchVault",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #7c3aed; margin: 0; font-size: 28px; font-weight: 900;">BuchVault</h1>
          <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; tracking: 1px;">Gestion de bibliothèque numérique</p>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin-bottom: 25px;" />

        <h2 style="color: #1e293b; font-size: 18px; font-weight: 700; margin-top: 0;">Bienvenue ${studentName} !</h2>
        
        <p style="color: #475569; font-size: 14px; line-height: 1.6; margin-bottom: 25px;">
          Merci de vous être inscrit sur BuchVault. Pour finaliser la création de votre compte et pouvoir réserver vos premiers ouvrages, merci de confirmer votre adresse email en cliquant sur le bouton ci-dessous :
        </p>
        
        <div style="text-align: center; margin: 35px 0;">
          <a href="${verificationLink}" style="background-color: #7c3aed; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block; shadow: 0 4px 6px -1px rgba(124, 58, 237, 0.1);">
            Activer mon compte
          </a>
        </div>
        
        <p style="color: #64748b; font-size: 12px; line-height: 1.5; background-color: #f8fafc; padding: 15px; border-radius: 2px; border-left: 1px solid #7c3aed;">
          <strong>Attention :</strong> Ce lien de confirmation est unique et expirera automatiquement dans <strong>24 heures</strong>.
        </p>

        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0 20px 0;" />
        
        <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">
          Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :<br />
          <a href="${verificationLink}" style="color: #3b82f6; text-decoration: underline;">${verificationLink}</a>
        </p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};



/**  
 * fonction pour envoyer le mail de réinitialisation de mot de passe à l'étudiant
 */
const sendResetPasswordEmail = async (studentEmail, resetLink) => {
  const mailOptions = {
    from: `BuchVault - Sécurité <${process.env.EMAIL_USER}>`,
    to: studentEmail, 
    subject: " Réinitialisation de votre mot de passe - BuchVault",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #7c3aed; margin: 0; font-size: 28px; font-weight: 900;">BuchVault</h1>
          <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase;">Sécurité du compte</p>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin-bottom: 25px;" />

        <h2 style="color: #1e293b; font-size: 18px; font-weight: 700; margin-top: 0;">Demande de nouveau mot de passe</h2>
        
        <p style="color: #475569; font-size: 14px; line-height: 1.6; margin-bottom: 25px;">
          Vous avez demandé à réinitialiser le mot de passe de votre compte BuchVault. Cliquez sur le bouton ci-dessous pour configurer un nouveau mot de passe (ce lien est valable <strong>1 heure</strong>) :
        </p>
        
        <div style="text-align: center; margin: 35px 0;">
          <a href="${resetLink}" style="background-color: #7c3aed; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block;">
            Réinitialiser mon mot de passe
          </a>
        </div>
        
        <p style="color: #64748b; font-size: 12px; line-height: 1.5; background-color: #f8fafc; padding: 15px; border-radius: 2px; border-left: 1px solid #7c3aed;">
          Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité. Votre mot de passe actuel restera inchangé.
        </p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};




/**  
 * Mail de rappel pour les retours en retard
 */
const sendOverdueReminder = async (to, studentName, bookTitle, dueDate) => {
  const mailOptions = {
    from: `"Le Service des Prêts" <${process.env.SMTP_USER}>`,
    to: to,
    subject: "[BuchVault] Rappel de restitution d'ouvrage - Bibliothèque Universitaire",
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #334155; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; rounded: 4px;">
        <h2 style="color: #0f172a; margin-top: 0;">Rappel de restitution d'ouvrage</h2>
        <p>Bonjour <strong>${studentName}</strong>,</p>
        <p>Sauf erreur de notre part, le délai d'emprunt pour l'ouvrage suivant est dépassé :</p>
        <ul style="background-color: #f8fafc; padding: 15px 15px 15px 35px; border-left: 4px solid #ef4444; list-style-type: none; margin: 20px 0;">
          <li style="margin-bottom: 5px;"><strong>Titre :</strong> ${bookTitle}</li>
          <li><strong>Date d'échéance attendue :</strong> ${dueDate}</li>
        </ul>
        <p>Nous vous invitons à restituer ce livre ou à vous présenter au guichet de la Bibliothèque (Bâtiment A) dans les plus brefs délais afin d'éviter la suspension temporaire de vos droits d'emprunt.</p>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 30px; border-top: 1px solid #e2e8f0; pt: 15px;">
          Si vous avez déjà retourné cet ouvrage ou initié une demande de retour sur votre espace BuchVault, veuillez ignorer ce message.
        </p>
        <p style="font-size: 13px; font-weight: bold; margin-top: 15px; color: #475569;">
          Le Service des Prêts — Bibliothèque Universitaire
        </p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail, sendResetPasswordEmail, sendOverdueReminder };