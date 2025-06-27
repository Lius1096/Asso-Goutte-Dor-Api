require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const articleRoutes = require('./routes/articleRoutes');
const authRoutes = require('./routes/authRoutes'); 
const adminRoutes = require('./routes/adminRoutes');
const sessionRoutes = require('./routes/sessionRoutes'); // Importer les routes de session
const sessionMiddleware = require('./middlewares/sessionMiddleware');
const contactRoutes = require ('./routes/contactRoutes.js');
const projectRoutes = require('./routes/projectRoutes');
const projectsIdea = require ('./routes/projectsIdea');
const userRoutes = require ('./routes/userRoutes');

// Connexion à MongoDB
connectDB();

const app = express();
// Session Middlewares
app.use(sessionMiddleware);

// Middlewares
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

app.use('/api/project-ideas/download', express.static(path.join(__dirname, 'quotes')));
// Servir les images statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Importer les routes
app.use('/api/articles', articleRoutes);
//routes authadmin
app.use('/api/auth', authRoutes); // Les routes d'authentification seront alors sous /api/auth/admin-login
// route admin
app.use('/api/admin', adminRoutes);
// Utiliser les routes liées aux sessions
app.use('/session', sessionRoutes);
//routes contacts
app.use('/api/contact', contactRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/project-ideas', projectsIdea);
app.use('/api/user', userRoutes);




// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`));
