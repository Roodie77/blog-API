const express = require("express");
const router = express.Router()

const { postArticle, getAllArticle, searchArticles, getArticleById, updateArticleById, deleteArticleById } = require("../controllers/article.controllers");
const requireAuth = require("../middlewares/requireAuth");

router.use(requireAuth);

router.post('/articles', postArticle);

router.get('/articles', getAllArticle);

router.get('/articles/search', searchArticles);

router.get('/articles/:id', getArticleById);

router.put('/articles/:id', updateArticleById);

router.delete('/articles/:id', deleteArticleById);

module.exports = router;
