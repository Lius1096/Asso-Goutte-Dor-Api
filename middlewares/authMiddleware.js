const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assurez-vous que le chemin est correct

// Middleware pour vérifier l'authentification
const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // On récupère le token du header Authorization

  if (!token) {
    return res.status(401).json({ message: "Accès non autorisé, token manquant" });
  }

  try {
    // Vérification du token avec la clé secrète
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupération de l'utilisateur à partir du token décodé
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Utilisateur introuvable" });
    }

    // Ajouter l'utilisateur à la requête pour l'utiliser dans les routes suivantes
    req.user = user;
    next(); // Passer au prochain middleware ou route
  } catch (error) {
    res.status(401).json({ message: "Token invalide" });
  }
};

// Middleware pour vérifier que l'utilisateur est un administrateur
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Accès interdit, vous n'êtes pas administrateur" });
  }
  next(); // Si l'utilisateur est admin, on continue
};

module.exports = { authenticate, isAdmin };
