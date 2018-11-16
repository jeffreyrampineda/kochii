import { InMemoryDbService } from 'angular-in-memory-web-api';
import { ItemInstance } from '../interfaces/item-instance';
import { Injectable } from '@angular/core';
import { Recipe } from '../interfaces/recipe';

@Injectable({
    providedIn: 'root',
  })
export class InMemoryDataService implements InMemoryDbService {

    added_date = new Date();
    expiration_date = new Date();

    createDb() {
        this.expiration_date.setDate(this.expiration_date.getDate() + 7);

        const inventory: ItemInstance[] = [
            new ItemInstance(1, "Eggs", 4, this.added_date, this.expiration_date ),
            new ItemInstance(2, "Butter", 2, this.added_date, this.expiration_date ),
            new ItemInstance(3, "Peanut", 5, this.added_date, this.expiration_date ),
            new ItemInstance(4, "Apples", 6, this.added_date, this.added_date ),
            new ItemInstance(5, "Lazy Item 1", 5, this.added_date, this.expiration_date ),
            new ItemInstance(6, "Lazy Item 2", 5, this.added_date, this.expiration_date ),
            new ItemInstance(7, "Lazy Item 3", 5, this.added_date, this.expiration_date ),
            new ItemInstance(8, "Lazy Item 4", 5, this.added_date, this.expiration_date ),
            new ItemInstance(9, "Lazy Item 5", 5, this.added_date, this.expiration_date ),
            new ItemInstance(10, "Lazy Item 6", 5, this.added_date, this.expiration_date ),
            new ItemInstance(11, "Lazy Item 7", 5, this.added_date, this.expiration_date ),
            new ItemInstance(12, "Lazy Item 8", 5, this.added_date, this.expiration_date ),
            new ItemInstance(13, "Lazy Item 9", 5, this.added_date, this.expiration_date ),
            new ItemInstance(14, "Lazy Item 10", 5, this.added_date, this.expiration_date ),
            new ItemInstance(15, "Lazy Item 11", 5, this.added_date, this.expiration_date ),
        ];

        const recipes: Recipe[] = [{
            id: 1,
            title: "Eggs du le Butter et Peanut",
            description: "A delicious egg mixed with butter topped with peanuts",
            ingredients: [
                new ItemInstance(1, "Eggs", 4, this.added_date, this.expiration_date ),
                new ItemInstance(2, "Butter", 2, this.added_date, this.expiration_date ),
                new ItemInstance(3, "Peanut", 5, this.added_date, this.expiration_date )
            ],
            steps: "1. Heat up butter. 2. Put the egg inside. 3. Put the peanuts inside."
        }, {
            id: 2,
            title: "Water du la fromage",
            description: "High quality sparkling water mixed with cheese",
            ingredients: [
                new ItemInstance(4, "Water", 2, this.added_date, this.expiration_date ),
                new ItemInstance(5, "Cheese", 4, this.added_date, this.expiration_date )
            ],
            steps: "1. Put the water in the bowl. 2. Put the cheese inside."
        }];

        return { inventory, recipes };
    }
}