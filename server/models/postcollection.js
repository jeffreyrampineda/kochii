const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const postCollectionSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "Account",
  },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
});

module.exports = mongoose.model("PostCollection", postCollectionSchema);
