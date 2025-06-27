const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware"); // Utilisation du middleware protect
const {
  getUserDashboard,
  getUserProjectHistory,
  updateUserProfile,
} = require("../controllers/userController");

// Accéder au dashboard de l'utilisateur
router.get("/dashboard", protect, getUserDashboard);

// Accéder à l'historique des projets soumis par l'utilisateur
router.get("/history", protect, getUserProjectHistory);

// Mettre à jour le profil de l'utilisateur (y compris la photo de profil)
router.put("/profile", protect, updateUserProfile);

module.exports = router;
