// controllers/sessionController.js
const User = require('../models/User'); // Ton modèle User pour la vérification des identifiants

// Fonction de connexion (démarrage de la session)
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Vérifier les identifiants dans la base de données
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send('Utilisateur non trouvé');
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password); // Assure-toi d'avoir une méthode comparePassword dans ton modèle User
    if (!isMatch) {
      return res.status(400).send('Mot de passe incorrect');
    }

    // Créer la session
    req.session.user = { username: user.username, id: user._id };
    res.send('Session démarrée');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
};

// Fonction pour vérifier si la session est active
exports.checkSession = (req, res) => {
  if (req.session.user) {
    res.send(`Bonjour ${req.session.user.username}, bienvenue sur votre profil`);
  } else {
    res.status(401).send('Aucune session active');
  }
};

// Fonction pour se déconnecter (détruire la session)
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Erreur lors de la déconnexion');
    }
    res.send('Session terminée');
  });
};
