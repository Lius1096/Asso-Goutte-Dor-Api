const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middlewares/authMiddleware'); // Importation des middlewares
const upload = require('../middlewares/upload'); // Importation de votre middleware de gestion des uploads

const {
  getUsers,
  deleteUser,
  addArticle,
  deleteArticle,
  getDashboard,
  getAdminProfile,
  updateProfile,
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

// Route pour récupérer le profil de l'admin
router.get('/profile', authenticate, isAdmin, getAdminProfile);

// Route pour mettre à jour le profil de l'admin, avec gestion de la photo de profil
router.put('/profile', authenticate, isAdmin, upload.single('profilePicture'), updateProfile);

module.exports = router;
