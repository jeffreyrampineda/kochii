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
        name: {
          type: String,
          required: [true, "Name is required"],
          minlength: [2, "Name must have a minimum length of 2"],
          maxlength: [30, "Name must have a maximum length of 30"],
          validate: {
            validator: (name) => /^[a-zA-Z0-9 _-]*$/.test(name),
            message:
              "Name must contain an alphanumeric, space ( ), underscore (_), or dash (-)",
          },
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [1, "Minimum quantity is 1"],
          max: [999, "Maximum quantity is 999"],
        },
        unit_of_measurement: { type: String },
        description: {
          type: String,
        },
      },
    ],
    instructions: [{ description: { type: String } }],
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
  return "/recipes/" + this._id;
});

postSchema.virtual("createdAt_formatted").get(function () {
  return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("Post", postSchema);
