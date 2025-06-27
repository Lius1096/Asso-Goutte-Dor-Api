require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Import routes & middleware
const articleRoutes = require('./routes/articleRoutes');
const authRoutes = require('./routes/authRoutes'); 
const adminRoutes = require('./routes/adminRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const sessionMiddleware = require('./middlewares/sessionMiddleware');
const contactRoutes = require('./routes/contactRoutes');
const projectRoutes = require('./routes/projectRoutes');
const projectsIdea = require('./routes/projectsIdea');
const userRoutes = require('./routes/userRoutes');

// Connexion à MongoDB
connectDB();

const app = express();

// Middlewares
app.use(sessionMiddleware);
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

// Serve fichiers statiques (PDFs, images, etc.)
app.use('/api/project-ideas/download', express.static(path.join(__dirname, 'quotes')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes API
app.use('/api/articles', articleRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/session', sessionRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/project-ideas', projectsIdea);
app.use('/api/user', userRoutes);

//  Servir le front React en production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../Asso-GouttedOr/build')));

  // Rediriger toutes les requêtes vers React index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Asso-GouttedOr/build', 'index.html'));
  });
}


// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`)
);
