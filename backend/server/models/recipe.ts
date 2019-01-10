import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;
const recipeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    ingredients: [{
        type: String
    }],
    steps: [{
        type: String
    }],
    image: { 
        data: Buffer,
        contentType: String
    },
    tags: [{
        type: String
    }]
});

export default mongoose.model('Recipe', recipeSchema);
