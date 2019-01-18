export interface Recipe {
    _id: string;
    title: string ;
    description: string;
    tags: string[];
    ingredients: { name: string, quantity: number }[];
    steps: string[];
}
