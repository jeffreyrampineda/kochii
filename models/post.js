const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;
const postSchema = new Schema(
  {
    title: { type: String, required: true },
    author: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    tags: [{ type: String }],
    cooking_time: { type: String },
    prep_time: { type: String },
    calories: { type: Number },
    servings: { type: Number },
    ingredients: [
      {
        name: { type: String, required: true },
        description: { type: String },
        quantity: { type: String, required: true },
        unit_of_measurement: { type: String },
      },
    ],
    instructions: [{ type: String }],
    content: { type: String },
    summary: { type: String },
    banner: { data: Buffer, contentType: String },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Virtual for post's URL
postSchema.virtual("url").get(function () {
  return "/blog/" + this._id;
});

postSchema.virtual("createdAt_formatted").get(function () {
  return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("Post", postSchema);
