const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const historySchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    history: [{
        created_at: {
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
        addedDate: {
            type: Date,
            required: true
        },
        quantity: {
            type: Number
        },
        description: {
            type: String
        }
    }]
});

module.exports = mongoose.model('History', historySchema);
