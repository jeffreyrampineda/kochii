const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const itemSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        validate: {
            validator: quantity => ItemModel.isGreaterThanZero({ quantity }),
            message: "Quantity must be greater than 0"
        },
    },
    addedDate: {
        type: Date,
        default: Date.now
    },
    expirationDate: {
        type: Date,
        default: Date.now
    },
    group: {
        type: String,
        default: 'Default'
    },
});

itemSchema.pre('findOneAndUpdate', function (next) {
    if (this._update.$inc) {
        if (parseInt(this._update.$inc.quantity) === 0) {
            next(new Error("Quantity cannot be 0"));
        }
    } else {
        if (parseInt(this._update.$set.quantity) === 0) {
            next(new Error("Quantity cannot be 0"));
        }
    }
    next();
});

itemSchema.statics.isGreaterThanZero = function (field) {
    return parseInt(field.quantity) > 0;
}

const ItemModel = mongoose.model('Item', itemSchema);

module.exports = ItemModel;
