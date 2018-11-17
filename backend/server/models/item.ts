import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;
const itemSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
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
});

export default mongoose.model('Item', itemSchema);
