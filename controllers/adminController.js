const User = require('../models/User');
const Article = require('../models/Article');
const { deleteFileIfExists } = require('../utils/fileUtils');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

// ✅ Récupérer tous les utilisateurs
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Supprimer un utilisateur + sa photo
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    deleteFileIfExists(user.profilePicture);
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Utilisateur supprimé" });

  } catch (error) {
    console.error("Erreur suppression utilisateur :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Ajouter un article
const addArticle = async (req, res) => {
  try {
    const newArticle = new Article(req.body);
    await newArticle.save();
    res.json({ message: "Article ajouté" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Supprimer un article
const deleteArticle = async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: "Article supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Dashboard Admin
const getDashboard = (req, res) => {
  res.json({ message: "Bienvenue dans l’espace admin" });
};

// ✅ Récupérer le profil de l'admin
const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select('-password');
    if (!admin) return res.status(404).json({ message: "Admin non trouvé" });
    if (admin.role !== 'admin') return res.status(403).json({ message: "Accès interdit" });

    res.json(admin);
  } catch (error) {
    console.error("Erreur récupération profil admin :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Mise à jour des infos du profil admin (hors photo)
exports.uploadProfilePicture = async (req, res) => {
  console.log("Données reçues :", req.body);  // Ajoutez ceci pour inspecter les données envoyées

  try {
    const { username, email, currentPassword, newPassword } = req.body;
    const profilePicture = req.file;

    const admin = await User.findById(req.user.id);
    if (!admin) return res.status(404).json({ message: 'Admin introuvable.' });

    // 🔐 Mot de passe
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, admin.password);
      if (!isMatch) return res.status(401).json({ message: 'Mot de passe actuel incorrect.' });
      admin.password = await bcrypt.hash(newPassword, 10);
    }

    // 👤 Username
    if (username && username.trim()) {
      admin.username = username.trim();
    }

    // 📧 Email sécurisé
    if (email && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Format de mail invalide.' });
      }
      admin.email = email.trim();
    }

    // 🖼️ Photo de profil
    if (profilePicture) {
      admin.profilePicture = `/uploads/${profilePicture.filename}`;
    }

    await admin.save();

    res.json({
      message: 'Profil mis à jour avec succès.',
      username: admin.username,
      email: admin.email,
      profilePicture: admin.profilePicture
    });
  } catch (error) {
    console.error('Erreur uploadProfilePicture :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};


// ✅ Upload/modification photo de profil admin
const uploadProfilePicture = async (req, res) => {
  try {
    const adminId = req.user.id;

    if (!req.file) return res.status(400).json({ message: 'Aucun fichier fourni.' });

    // Le fichier est stocké dans 'uploads/profile-pictures'
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/profile-pictures/${req.file.filename}`;

    const admin = await User.findById(adminId);
    if (!admin) return res.status(404).json({ message: 'Admin non trouvé' });

    // Suppression de l'ancienne photo si elle existe
    if (admin.profilePicture) {
      const oldPath = path.join(__dirname, '..', admin.profilePicture.replace(`${req.protocol}://${req.get('host')}`, ''));
      fs.unlink(oldPath, (err) => {
        if (err) console.warn('Ancienne image non supprimée :', err.message);
      });
    }

    // Mise à jour du chemin de la photo de profil dans la base de données
    admin.profilePicture = `/uploads/profile-pictures/${req.file.filename}`;
    await admin.save();

    res.status(200).json({
      message: 'Photo de profil mise à jour',
      profilePicture: admin.profilePicture
    });

  } catch (error) {
    console.error("Erreur upload photo :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};



// ✅ Modifier le mot de passe
const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const admin = await User.findById(req.user.id);
    if (!admin) return res.status(404).json({ message: "Admin non trouvé" });
    if (admin.role !== 'admin') return res.status(403).json({ message: "Accès interdit" });

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Ancien mot de passe incorrect" });

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);

    await admin.save();
    res.status(200).json({ message: "Mot de passe mis à jour avec succès" });

  } catch (error) {
    console.error("Erreur update password :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  getUsers,
  deleteUser,
  addArticle,
  deleteArticle,
  getDashboard,
  getAdminProfile,
  //uploadProfilePicture,
  updatePassword,
  uploadProfilePicture,
};
