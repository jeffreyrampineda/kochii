import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Item } from '../interfaces/item';
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

        const inventory: Item[] = [
            { id: 1, name: "Egg", quantity: 4, addedDate: this.added_date, expirationDate: this.expiration_date },
            { id: 2, name: "Butter", quantity: 2, addedDate: this.added_date, expirationDate: this.expiration_date },
            { id: 3, name: "Peanut", quantity: 5, addedDate: this.added_date, expirationDate: this.expiration_date },
            { id: 4, name: "Apple", quantity: 6, addedDate: this.added_date, expirationDate: this.expiration_date },
            { id: 5, name: "Lazy Item 1", quantity: 7, addedDate: this.added_date, expirationDate: this.expiration_date },
            { id: 6, name: "Lazy Item 2", quantity: 6, addedDate: this.added_date, expirationDate: this.expiration_date },
            { id: 7, name: "Lazy Item 3", quantity: 5, addedDate: this.added_date, expirationDate: this.expiration_date },
            { id: 8, name: "Lazy Item 4", quantity: 5, addedDate: this.added_date, expirationDate: this.expiration_date },
            { id: 9, name: "Lazy Item 5", quantity: 4, addedDate: this.added_date, expirationDate: this.expiration_date },
            { id: 10, name: "Lazy Item 6", quantity: 3, addedDate: this.added_date, expirationDate: this.expiration_date },
            { id: 11, name: "Lazy Item 7", quantity: 2, addedDate: this.added_date, expirationDate: this.expiration_date },
            { id: 12, name: "Lazy Item 8", quantity: 8, addedDate: this.added_date, expirationDate: this.expiration_date },
        ];

        const recipes: Recipe[] = [{
            id: 1,
            title: "Eggs du le Butter et Peanut",
            description: "A delicious egg mixed with butter topped with peanuts",
            ingredients: [
                { id: 1, name: "Egg", quantity: 4, addedDate: this.added_date, expirationDate: this.expiration_date },
                { id: 2, name: "Butter", quantity: 2, addedDate: this.added_date, expirationDate: this.expiration_date },
                { id: 3, name: "Peanut", quantity: 5, addedDate: this.added_date, expirationDate: this.expiration_date },
            ],
            steps: "1. Heat up butter. 2. Put the egg inside. 3. Put the peanuts inside."
        }, {
            id: 2,
            title: "Water du la fromage",
            description: "High quality sparkling water mixed with cheese",
            ingredients: [
                { id: 1, name: "Egg", quantity: 4, addedDate: this.added_date, expirationDate: this.expiration_date },
                { id: 2, name: "Butter", quantity: 2, addedDate: this.added_date, expirationDate: this.expiration_date },
            ],
            steps: "1. Put the water in the bowl. 2. Put the cheese inside."
        }];

        return { inventory, recipes };
    }
}