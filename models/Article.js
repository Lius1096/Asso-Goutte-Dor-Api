const mongoose = require('mongoose');

// Schéma de l'article
const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        default: '',  // Le sous-titre est facultatif
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,  // Date de création de l'article
    },
    image: {
        type: String,
        required: false,  // L'image est optionnelle
    },
});

// Création du modèle Article à partir du schéma
const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
