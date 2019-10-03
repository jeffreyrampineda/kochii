import * as mongoose from 'mongoose';

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

export default mongoose.model('Group', groupSchema);
