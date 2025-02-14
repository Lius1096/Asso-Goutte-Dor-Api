const session = require('express-session');

// Utilisation de process.env pour accéder à la clé secrète
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET, 
  resave: false,               
  saveUninitialized: true,     
  cookie: { secure: false }
});

module.exports = sessionMiddleware;
