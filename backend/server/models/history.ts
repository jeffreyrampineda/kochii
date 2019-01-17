import * as mongoose from 'mongoose';

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
    description: {
        type: String
    }
});

export default mongoose.model('History', historySchema);
