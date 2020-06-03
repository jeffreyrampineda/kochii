const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const historySchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    method: {
        type: String,
        required: true
    },
    target: {
        type: String,
        required: true
    },
    quantityChange: {
        type: Number
    },
    description: {
        type: String
    }
});

module.exports = mongoose.model('History', historySchema);
