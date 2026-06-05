
const jwt = require("jsonwebtoken");

 
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Accès refusé. Jeton manquant." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
    req.sessionRef = decoded.session_ref; 
    next();
  } catch (err) {
    return res.status(403).json({ message: "Accès Admin Interdit." });
  }
};


const verifyUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Accès refusé. Jeton manquant." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_USER);
    req.sessionRef = decoded.session_ref;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Accès Étudiant Interdit." });
  }
};

const verifyUserOrAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Accès refusé. Jeton manquant." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 1. On tente d'abord de valider avec la clé ÉTUDIANT
    const decoded = jwt.verify(token, process.env.JWT_SECRET_USER);
    
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.sessionRef = decoded.session_ref;
    
    return next();
  } catch (userErr) {
    try {
      // 2. Si ça échoue, on tente de valider avec la clé ADMIN
      const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
      
      req.userId = decoded.userId;
      req.userRole = decoded.role;
      req.sessionRef = decoded.session_ref;
      
      return next();
    } catch (adminErr) {
      // 3. Si les deux échouent, le jeton est définitivement invalide ou expiré
      return res.status(403).json({ message: "Session invalide ou expirée." });
    }
  }
};

module.exports = { verifyAdmin, verifyUser, verifyUserOrAdmin };