// routes/sessionRoutes.js
const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController'); // Import du contrôleur

// Route pour se connecter (démarrer une session)
router.post('/login', sessionController.login);

// Route pour vérifier la session
router.get('/profile', sessionController.checkSession);

// Route pour se déconnecter
router.get('/logout', sessionController.logout);

module.exports = router;
