const rateLimit = require('express-rate-limit');

const ipLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Fenêtre de 15 minutes
    max: 100, // Limite chaque IP à 100 requêtes par fenêtre
    standardHeaders: true, // Renvoie les informations de limite dans les headers HTTP
    legacyHeaders: false,
    message: {
        error: "Trop de requêtes générées depuis cette adresse IP. Réessayez dans 15 minutes."
    }
});

// Bloquer les tentatives répétées sur un même compte, même si le hacker change d'IP.
const emailLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // Fenêtre plus courte : 5 minutes
    max: 5, // 5 tentatives maximum par email dans ces 5 minutes (comme demandé par ton expert)
    standardHeaders: true,
    legacyHeaders: false,
    
    // On change la clé d'identification : au lieu de req.ip, on utilise l'email reçu dans le body
    keyGenerator: (req) => {
        // On récupère l'email, on le passe en minuscules et on enlève les espaces pour éviter les contournements malins
        if (req.body.email) {
            return req.body.email.trim().toLowerCase();
        }
        return req.rateLimit.options.defaultKeyGenerator(req);
    },
    
    message: {
        error: "Trop de tentatives de connexion échouées pour ce compte. Accès bloqué pendant 5 minutes."
    }
});

module.exports = { ipLimiter, emailLimiter };