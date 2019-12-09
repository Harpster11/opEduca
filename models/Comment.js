var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var cmtSchema = new Schema({
    _headlineId: {
        type: Schema.Types.ObjectId,
        ref: "Headline"
    },
   
    date: String,
    comment: String
});

var Headline = mongoose.model("Comment", headlineSchema);

module.exports = Headline;