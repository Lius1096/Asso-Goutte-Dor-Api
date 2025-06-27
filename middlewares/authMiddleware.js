const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware pour vérifier le token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Utilisateur non autorisé' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Token invalide ou expiré' });
    }
  } else {
    res.status(401).json({ message: 'Aucun token fourni' });
  }
};

// Middleware pour vérifier si l'utilisateur est admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Accès refusé : réservée aux admins' });
  }
};

module.exports = { protect, isAdmin };
