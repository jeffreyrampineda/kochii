import { ItemInstance } from "./item-instance";

export interface Recipe {
    id: number;
    title: string ;
    description: string;
    ingredients: ItemInstance[];
    steps: string; 
}