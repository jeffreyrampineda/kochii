const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const itemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
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
    },
});

module.exports = mongoose.model('Item', itemSchema);
