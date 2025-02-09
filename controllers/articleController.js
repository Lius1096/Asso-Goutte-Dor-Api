const Article = require('../models/Article');
const fs = require('fs');
const path = require('path');

// Obtenir tous les articles
exports.getArticles = async (req, res) => {
    try {
        const articles = await Article.find();
        res.status(200).json(articles);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Erreur lors de la récupération des articles' });
    }
};

// Obtenir un article par ID
exports.getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: 'Article non trouvé' });
        }
        res.status(200).json(article);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'article' });
    }
};

// Ajouter un nouvel article avec upload d'image
exports.createArticle = async (req, res) => {
    try {
        const { title, content, author, subtitle } = req.body;

        if (!title || !content || !author) {
            return res.status(400).json({ message: 'Veuillez remplir tous les champs obligatoires' });
        }

        const image = req.file ? `/uploads/${req.file.filename}` : ''; // Stocke l'image si elle est envoyée

        const newArticle = new Article({ title, content, author, subtitle, image });
        await newArticle.save();
        
        res.status(201).json({ message: 'Article ajouté avec succès', article: newArticle });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'article' });
    }
};

// Mettre à jour un article avec possibilité de changer l'image
exports.updateArticle = async (req, res) => {
    try {
        const { title, content, author, subtitle } = req.body;
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ message: 'Article non trouvé' });
        }

        let image = article.image;
        if (req.file) {
            // Supprime l'ancienne image
            if (article.image) {
                fs.unlinkSync(path.join(__dirname, '..', article.image));
            }
            image = `/uploads/${req.file.filename}`;
        }

        const updatedArticle = await Article.findByIdAndUpdate(
            req.params.id,
            { title, content, author, subtitle, image },
            { new: true, runValidators: true }
        );

        res.status(200).json({ message: 'Article mis à jour avec succès', article: updatedArticle });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'article' });
    }
};

// Supprimer un article et son image associée
exports.deleteArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ message: 'Article non trouvé' });
        }

        if (article.image) {
            fs.unlinkSync(path.join(__dirname, '..', article.image)); // Supprime l'image
        }

        await Article.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Article supprimé avec succès' });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'article' });
    }
};
