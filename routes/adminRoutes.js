const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middlewares/authMiddleware'); // Correction ici
const upload = require('../middlewares/upload');

const {
  getUsers,
  deleteUser,
  addArticle,
  deleteArticle,
  getDashboard,
  getAdminProfile,
  uploadProfilePicture,
  updatePassword,
  //uploadProfilePicture, // Ajout de updatePassword dans le destructuring
} = require('../controllers/adminController'); // Vérifie que updatePassword est bien exporté depuis adminController

// Récupérer tous les utilisateurs
router.get('/users', protect, isAdmin, getUsers);

// Supprimer un utilisateur
router.delete('/users/:id', protect, isAdmin, deleteUser);

// Ajouter un article
router.post('/articles', protect, isAdmin, addArticle);

// Supprimer un article
router.delete('/articles/:id', protect, isAdmin, deleteArticle);

// Dashboard Admin (accès réservé aux administrateurs)
router.get('/dashboard', protect, isAdmin, getDashboard);

// Récupérer le profil admin
router.get('/profile', protect, isAdmin, getAdminProfile);

// Mettre à jour le profil admin (avec upload image)
router.put('/profile', protect, isAdmin, upload.single('profilePicture'),uploadProfilePicture);

// Route pour changer le mot de passe
router.put('/admin/password', protect, isAdmin, updatePassword); // Utilisation de la méthode correcte


module.exports = router;
