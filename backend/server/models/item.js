const mongoose = require('mongoose');
const Group = require('./group');

const Schema = mongoose.Schema;
const itemSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: [2, "Name must have a minimum length of 2"],
        maxlength: [30, "Name must have a maximum length of 30"],
        validate: {
            validator: name => /^[a-zA-Z0-9 _-]*$/.test(name),
            message: "Name must contain an alphanumeric, space ( ), underscore (_), or dash (-)"
        }
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [1, "Minimum quantity is 1"],
        max: [999, "Maximum quantity is 999"]
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
        default: 'Default',
        validate: {
            validator: group => ItemModel.doesGroupExist(group),
            message: "Group does not exist"
        }
    }
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

itemSchema.statics.doesGroupExist = async function (group) {
    return await Group.exists({ name: group });
}

const ItemModel = mongoose.model('Item', itemSchema);

module.exports = ItemModel;
