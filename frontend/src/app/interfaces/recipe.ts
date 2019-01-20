export interface Recipe {
    _id: string;
    title: string ;
    description: string;
    tags: string[];
    ingredients: { name: string, quantity: number }[];
    steps: string[];
    // TODO: include nutrition facts.
    nutritionFacts: {
        servingsPerContainer: number;
        quantity: number;
        units: number;
        size: number;
// -------------------------------------------------------------
        calories: number;
// -------------------------------------------------------------
        fats: {
            total: number,
            saturated: number,
            trans: number
        };
        cholesterol: number;
        sodium: number;
        carbohydrates: {
            total: number,
            dietaryFiber: number,
            sugars: number,
            addedSugars: number,
        };
        protein: number;
    };
}
