const User = require('../models/User');
const Article = require('../models/Article');

// Récupérer tous les utilisateurs
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Supprimer un utilisateur
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Utilisateur supprimé" });
  } catch (error) {
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

module.exports = {
  getUsers,
  deleteUser,
  addArticle,
  deleteArticle,
  getDashboard,
};
