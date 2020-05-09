const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const groupSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Group', groupSchema);
