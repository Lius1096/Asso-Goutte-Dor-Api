const express = require('express');
const {
    getArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle
} = require('../controllers/articleController');

const upload = require('../middlewares/upload'); // Import du middleware d'upload

const router = express.Router();

// Routes CRUD
router.get('/', getArticles);               
router.get('/:id', getArticleById);         

router.post('/', upload.single('image'), createArticle);  // Upload d'image lors de la création
router.put('/:id', upload.single('image'), updateArticle); // Upload d'image lors de la mise à jour

router.delete('/:id', deleteArticle);       

module.exports = router;
