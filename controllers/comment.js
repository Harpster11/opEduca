
var db = require("../models");

module.exports = {
  // find all comments
  find: function(req, res) {
    db.Comment.find({ _headlineId: req.params.id }).then(function(dbComment) {
      res.json(dbComment);
    });
  },
  // Create new comment
  create: function(req, res) {
    db.Comment.create(req.body).then(function(dbComment) {
      res.json(dbComment);
    });
  },
  // Delete a comment by id
  delete: function(req, res) {
    db.Comment.remove({ _id: req.params.id }).then(function(dbComment) {
      res.json(dbComment);
    });
  }
};
