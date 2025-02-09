const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Fonction utilitaire pour générer un JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );
};

// Inscription de l'administrateur
const registerAdmin = async (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Le nom d'utilisateur, l'email et le mot de passe sont requis." });
  }

  try {
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Un utilisateur avec cet email existe déjà." });
    }

    // Créer l'utilisateur (le hachage se fait dans le middleware pre-save)
    const newAdmin = new User({
      username,
      email,
      password,
      role: 'admin'
    });

    await newAdmin.save();
 // Générer le token JWT
    const token = generateToken(newAdmin);
    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur, veuillez réessayer plus tard." });
  }
};

// Connexion de l'administrateur
const loginAdmin = async (req, res) => {
  const { identifier, password } = req.body; // identifier peut être email ou username

  if (!identifier || !password) {
    return res.status(400).json({ message: "L'identifiant et le mot de passe sont requis." });
  }

  try {
    // Recherche de l'utilisateur par email ou username
    const admin = await User.findOne({ 
      $or: [
        { email: identifier },
        { username: identifier }
      ]
    });

    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: "Accès interdit" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const token = generateToken(admin);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur, veuillez réessayer plus tard." });
  }
};

module.exports = { registerAdmin, loginAdmin };
