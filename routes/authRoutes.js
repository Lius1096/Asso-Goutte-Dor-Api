const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  refreshToken,
  registerAdmin,
  loginAdmin,
} = require('../controllers/authController');

// Auth utilisateur
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);

// Auth admin
router.post('/register/admin', registerAdmin);
router.post('/login/admin', loginAdmin);

module.exports = router;
