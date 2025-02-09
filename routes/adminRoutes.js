const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middlewares/authMiddleware'); // Importation des middlewares
const {
  getUsers,
  deleteUser,
  addArticle,
  deleteArticle,
  getDashboard,
} = require('../controllers/adminController'); // Importation des contrôleurs

// Récupérer tous les utilisateurs
router.get('/users', authenticate, isAdmin, getUsers);

// Supprimer un utilisateur
router.delete('/users/:id', authenticate, isAdmin, deleteUser);

// Ajouter un article
router.post('/articles', authenticate, isAdmin, addArticle);

// Supprimer un article
router.delete('/articles/:id', authenticate, isAdmin, deleteArticle);

// Dashboard Admin (accès réservé aux administrateurs)
router.get('/dashboard', authenticate, isAdmin, getDashboard);

module.exports = router;
