import * as mongoose from 'mongoose';

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
    quantityType: {
        type: String,           // Example: 'slices', 'bottles', 'box'
    },
    measurementPerQuantity: {
        type: Number,
    },
    measurementType: {
        type: String,           // Example: 'mg', 'g', 'pieces'
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
