import { Item } from "./item";

export interface Recipe {
    id: number;
    title: string ;
    description: string;
    ingredients: Item[];
    steps: string; 
}