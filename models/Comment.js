
var mongoose = require("mongoose");
// Create a comment schema using mongoose
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  // Associated headline with comments
  _headlineId: {
    type: Schema.Types.ObjectId,
    ref: "Headline"
  },
  date: {
    type: Date,
    default: Date.now
  },
  CommentText: String
});

var Comment = mongoose.model("Comment", commentSchema);

// Export the model
module.exports = Comment;
