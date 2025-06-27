const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Générer un token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Générer un refresh token JWT (plus long durée)
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' } // Exemple : expiration du refresh token après 30 jours
  );
};

// @desc    Inscription
// @route   POST /api/auth/register
const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username ou email déjà utilisé' });
    }

    // Créer un nouvel utilisateur
    const newUser = new User({ username, email, password });
    await newUser.save();

    // Générer un token et un refresh token
    const token = generateToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    res.status(201).json({
      message: 'Inscription réussie',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      token,
      refreshToken, // Inclure le refresh token dans la réponse
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription' });
  }
};

// @desc    Connexion
// @route   POST /api/auth/login
const login = async (req, res) => {
  const { identifier, password } = req.body; // identifier = email ou username

  try {
    // Rechercher l'utilisateur par username ou email
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // Générer un token et un refresh token
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(200).json({
      message: 'Connexion réussie',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
      refreshToken, // Inclure le refresh token dans la réponse
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
};

// @desc    Déconnexion (log out)
// @route   POST /api/auth/logout
const logout = (req, res) => {
  // La déconnexion côté serveur est simplement une suppression du token côté client.
  // Côté client, il faut supprimer le token du localStorage, cookies, etc.
  res.status(200).json({ message: 'Déconnexion réussie' });
};

// @desc    Rafraîchir le token JWT (Refresh Token)
// @route   POST /api/auth/refresh-token
const refreshToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token manquant' });
  }

  try {
    // Vérifier la validité du refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // Si le refresh token est valide, générer un nouveau JWT
    const newToken = generateToken(decoded);

    res.status(200).json({
      message: 'Token rafraîchi avec succès',
      token: newToken,
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Refresh token invalide ou expiré' });
  }
};


// Enregistrement d’un admin
const registerAdmin = async (req, res) => {
  // Même logique que register, mais tu forces role: 'admin'
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Admin déjà existant' });
    }

    const newAdmin = new User({ username, email, password, role: 'admin' });
    await newAdmin.save();

    const token = generateToken(newAdmin);
    const refreshToken = generateRefreshToken(newAdmin);

    res.status(201).json({
      message: 'Admin enregistré avec succès',
      user: {
        id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role,
      },
      token,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription de l\'admin' });
  }
};

// Connexion d’un admin
const loginAdmin = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const admin = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
      role: 'admin',
    });

    if (!admin) {
      return res.status(401).json({ message: 'Admin non trouvé' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    const token = generateToken(admin);
    const refreshToken = generateRefreshToken(admin);

    res.status(200).json({
      message: 'Connexion admin réussie',
      user: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
      token,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion de l\'admin' });
  }
};


module.exports = {
  register,
  login,
  logout,
  refreshToken,
  registerAdmin,
  loginAdmin,
};
