const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const inventorySchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    groups: [
      {
        type: String,
        required: [true, "Name is required"],
        minlength: [1, "Name must have a minimum length of 1"],
        maxlength: [30, "Name must have a maximum length of 30"],
        validate: {
          validator: (group) => /^[a-zA-Z0-9 _-]*$/.test(group),
          message:
            "Name must contain an alphanumeric, space ( ), underscore (_), or dash (-)",
        },
        // TODO - validation doesNotExist
      },
    ],
    items: [
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
        cost: {
          type: Number,
          required: [true, "Cost is requred"],
          min: [0, "Minimum cost is 0"],
          max: [999, "Maximum cost is 999"],
        },
        addedDate: {
          type: Date,
          default: Date.now,
        },
        expirationDate: {
          type: Date,
          default: Date.now,
        },
        group: {
          type: String,
          default: "Default",
          minlength: [1, "Group must have a minimum length of 1"],
          maxlength: [30, "Group must have a maximum length of 30"],
          validate: {
            validator: (group) => /^[a-zA-Z0-9 _-]*$/.test(group),
            message:
              "Group must contain an alphanumeric, space ( ), underscore (_), or dash (-)",
          },
          // TODO - validation doesGroupExist
        },
      },
    ],
  },
  { timestamps: true }
);

inventorySchema.pre("findOneAndUpdate", function (next) {
  const pull = this._update.$pull;
  const set = this._update.$set;
  const inc = this._update.$inc;

  if (inc && inc["items.$.quantity"] === 0) {
    next(new Error("Quantity cannot be 0"));
  }
  if (set["items.$.quantity"] === 0) {
    next(new Error("Quantity cannot be 0"));
  }
  if (pull) {
    if (pull.groups && pull.groups === "Default") {
      next(new Error("Cannot remove group"));
    }
  }
  next();
});

const InventoryModel = mongoose.model("Inventory", inventorySchema);

module.exports = InventoryModel;
