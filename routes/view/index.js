var router = require("express").Router();
var db = require("../../models");

// Homepage route
router.get("/", function(req, res) {
  db.Headline.find({ saved: false })
    .sort({ date: -1 })
    .then(function(dbArticles) {
      res.render("home", { articles: dbArticles });
    });
});

// Saved comments route
router.get("/saved", function(req, res) {
  db.Headline.find({ saved: true })
    .sort({ date: -1 })
    .then(function(dbArticles) {
      res.render("saved", { articles: dbArticles });
    });
});

module.exports = router;
