const User = require('../models/User');
const fs = require('fs');  // Importation de fs pour supprimer les anciennes photos
const path = require('path');

// Récupérer tous les utilisateurs
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Supprimer l'image de profil si elle existe
if (user.profilePicture) {
  const filePath = path.join(__dirname, '..', user.profilePicture); // Créer le chemin absolu
  fs.unlink(filePath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error("Erreur suppression photo :", err);
    }
  });
}


    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Utilisateur supprimé" });

  } catch (error) {
    console.error("Erreur suppression utilisateur :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// Ajouter un article
const addArticle = async (req, res) => {
  try {
    const newArticle = new Article(req.body);
    await newArticle.save();
    res.json({ message: "Article ajouté" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Supprimer un article
const deleteArticle = async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: "Article supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Dashboard Admin (accès réservé aux administrateurs)
const getDashboard = (req, res) => {
  res.json({ message: "Bienvenue dans l’espace admin" });
};

// Récupérer le profil de l'admin
const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select('-password'); // Exclure le mot de passe

    if (!admin) {
      return res.status(404).json({ message: "Admin non trouvé" });
    }

    if (admin.role !== 'admin') {
      return res.status(403).json({ message: "Accès interdit" });
    }

    res.json(admin);
  } catch (error) {
    console.error("Erreur lors de la récupération du profil de l'admin :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Mise à jour du profil de l'admin
const updateProfile = async (req, res) => {
  const { username, email, firstName, lastName } = req.body;
  const profilePicture = req.file ? `/uploads/${req.file.filename}` : '';  // Chemin de l'image uploadée

  console.log("Profil Picture:", profilePicture); // Log du chemin de l'image

  try {
    const admin = await User.findById(req.user.id); // Trouver l'admin actuel

    if (!admin) {
      return res.status(404).json({ message: 'Admin non trouvé' });
    }

    // Mise à jour des informations de l'admin
    admin.username = username || admin.username;
    admin.email = email || admin.email;
    admin.firstName = firstName || admin.firstName;
    admin.lastName = lastName || admin.lastName;

    if (profilePicture) {
      // Log de la mise à jour de l'image
      console.log("Mise à jour du chemin de l'image:", profilePicture);

      // Supprimer l'ancienne photo de profil si elle existe
      if (admin.profilePicture) {
        const filePath = path.join(__dirname, '..', admin.profilePicture); // Créer le chemin absolu
        fs.unlink(filePath, (err) => {
          if (err && err.code !== 'ENOENT') {
            console.error("Erreur suppression photo :", err);
          }
        });
      }
      admin.profilePicture = profilePicture; // Mettre à jour l'image si présente
    }

    // Sauvegarder les modifications
    await admin.save();

    res.status(200).json({ message: 'Profil mis à jour avec succès', admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil' });
  }
};


module.exports = {
  getUsers,
  deleteUser,
  addArticle,
  deleteArticle,
  getDashboard,
  getAdminProfile,
  updateProfile,
};
