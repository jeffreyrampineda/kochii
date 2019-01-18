import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;
const recipeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: { 
        data: Buffer,
        contentType: String
    },
    tags: [{ type: String }],
    ingredients: [{ name: String, quantity: Number }],
    steps: [{ type: String }]
});

export default mongoose.model('Recipe', recipeSchema);
