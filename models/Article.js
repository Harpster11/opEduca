var mongoose = require("mongoose");
var mongooseSchema = mongoose.Schema;

// Build user schema
var articleSchema = new mongooseSchema({
  // require a title as a string
  title: {
    type: String,
    required: true
  },
// require a link as a string
  link: {
    type: String,
    required: true
  },
  // create an object to hold a comment
  comment: {
    type: articleSchema.Types.ObjectId,
    ref: "Comment"
  }
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", articleSchema);

// Export the Article model
module.exports = Article;
