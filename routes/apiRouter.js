const express = require("express");
const router = express.Router();
const apiController = require("../controllers/apiController");
const authMiddleware = require("../middlewares/authMiddleware")

// reviews
router.get("/articles", apiController.articles_get);

// titles
router.get("/titles", apiController.titles_get);

// review
router.post("/articles", apiController.article_post);
router.get("/articles/:articleId", apiController.article_get);


module.exports = router;
