const ProjectIdea = require("../models/ProjectIdea");
const User = require("../models/User");

// Afficher le dashboard de l'utilisateur
exports.getUserDashboard = async (req, res) => {
  try {
    const user = req.user;  // L'utilisateur est déjà attaché à la requête par protect
    res.status(200).json({
      user: {
        username: user.username,
        email: user.email,
        // Tu peux ajouter d'autres informations pertinentes ici
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du dashboard utilisateur :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Afficher l'historique des projets soumis par l'utilisateur
exports.getUserProjectHistory = async (req, res) => {
  try {
    const userId = req.user._id;  // Récupérer l'ID de l'utilisateur à partir de req.user

    // Récupérer tous les projets associés à cet utilisateur
    const projects = await ProjectIdea.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique des projets :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Mettre à jour le profil de l'utilisateur
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user._id;

    // Vérification des champs requis
    if (!name || !email) {
      return res.status(400).json({ error: "Nom et email sont requis" });
    }

    // Mise à jour de l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }  // Retourne l'utilisateur mis à jour
    );

    res.status(200).json({
      message: "Profil mis à jour avec succès",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil utilisateur :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
