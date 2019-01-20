import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

// TODO: redesign to reduce payload.
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
    steps: [{ type: String }],
    nutritionFacts: {
        servingsPerContainer: { type: Number },
        quantity: { type: Number },
        units: { type: Number },
        size: { type: Number },
// -------------------------------------------------------------
        calories: { type: Number },
// -------------------------------------------------------------
        fats: {
            total: Number,
            saturated: Number,
            trans: Number
        },
        cholesterol: { type: Number },
        sodium: { type: Number },
        carbohydrates: {
            total: Number,
            dietaryFiber: Number,
            sugars: Number,
            addedSugars: Number,
        },
        protein: { type: Number },
    }
});

export default mongoose.model('Recipe', recipeSchema);
