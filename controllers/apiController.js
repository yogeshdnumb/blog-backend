const asyncHandler = require("express-async-handler");
const articleModel = require("../models/articleModel");

exports.titles_get = asyncHandler(async function (req, res, next) {
  // setTimeout(async () => {
  const titles = await articleModel.find({}, "title");
  console.log(titles);
  if (titles.length != 0) {
    res.status(200).json({ message: "got titles", titles });
  } else {
    res.status(201).json({ message: "no titles" });
  }
},
  //  5000);
  // }
)

exports.articles_get = asyncHandler(async function (req, res, next) {
  const articles = await articleModel.find();
  if (articles.length != 0) {
    res.status(200).json({ message: "got articles", articles });
  } else {
    res.status(201).json({ message: "no articles" });
  }
});

exports.article_get = asyncHandler(async function (req, res, next) {
  const article = await articleModel.findOne({ _id: req.params.articleId });
  if (article) {
    res.status(200).json({
      message: `got review with id=${req.params.articleId}`,
      article,
    });
  } else {
    res
      .status(400)
      .json({ message: `review with id=${req.params.articleId} not found` });
  }
});

exports.article_post = asyncHandler(async function (req, res, next) {
  let data = req.body
  console.log(data);
  const article = new articleModel({ ...data })
  await article.save()
  res.status(200).json({
    msg:
      "article created"
  })
})

exports.protected_get = asyncHandler(async function (req, res, next) {
  res.send('protected admin')
})