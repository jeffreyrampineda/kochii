import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RecipeService } from 'src/app/services/recipe.service';
import { Recipe } from 'src/app/interfaces/recipe';
import { InventoryService } from 'src/app/services/inventory.service';
import { Item } from 'src/app/interfaces/item';

//-------------------------------------------------------------

@Component({
  selector: 'recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  @Input() recipe: Recipe;

  constructor(
    private route: ActivatedRoute,
    private inventoryService: InventoryService,
    private recipeService: RecipeService,
    private location: Location
  ) { }

//-------------------------------------------------------------

  ngOnInit() {
    this.getRecipe();
  }

  /** 
   * Get the recipe with the snapshot id received and set it 
   * for presentation. 
   * */
  getRecipe(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.recipeService.getRecipeById(id).subscribe(
      recipe => {
        this.recipe = recipe
      }
    );
  }

  /** Go back to the previous URL */
  goBack(): void {
    this.location.back();
  }

  /**
   * Loops through newItems and update each item individually.
   * @param newItems - The array of items to be updated.
   */
  updateManyItem(newItems: Item[]): void {
    let observablesGroup = [];

    newItems.forEach(
      newItem => {
        observablesGroup.push(this.updateItem(newItem));
      }
    );

    forkJoin(observablesGroup).subscribe(
      x => {
        console.log(x);
      }
    );
  }

  /**
   * Update the item with the same name and expirationDate,
   * @param newItem - The item to be updated.
   */
  updateItem(newItem: Item): Observable<any> {
    return this.inventoryService.updateItem(newItem, 'inc').pipe(
      map(
        results => {
          return results;
        }
      )
    );
  }

  /**
   * Checks if inventory have enough of the required ingredients.
   * If enough is available, deduct the required ingredients' quantity
   * from the inventory. Otherwise, show the missing ingredients.
   * 
   * NOTES - Can be simplified.
   */
  cook(): void {
    let ingredientsRequired = JSON.parse(JSON.stringify(this.recipe.ingredients));
    let ingredientsRequiredNames = ingredientsRequired.map(e => { return e.name });

    this.inventoryService.getItemsByNames(ingredientsRequiredNames).subscribe(
      items => {
        //console.log(items);

        let noDuplicates: any = [];
        //let duplicates: any = [];

        // Has duplicate due to different expirationDates.
        if(items.length > ingredientsRequiredNames.length) {
          items.forEach(
            i => {

              // Try to find if item 'i's name exists in noDuplicate.
              let notUnique = noDuplicates.find(n => n.name === i.name && n._id !== i._id);

              // Item 'i's name already exists, append 'i's quantity to the existing item in noDuplicate instead.
              if(notUnique) {
                notUnique.quantity += i.quantity;
                //duplicates.push(JSON.parse(JSON.stringify(i)));
              }
              
              // Otherwise, item 'i's name is unique. Push to noDuplicate.
              else {
                noDuplicates.push(JSON.parse(JSON.stringify(i)));
              }
            }
          );
        
          //console.log(duplicates);
          //console.log(noDuplicates);
        }
        
        // Otherwise, there are no duplicates.
        else {
          noDuplicates = JSON.parse(JSON.stringify(items));
        }

        // Has missing ingredients.
        if(noDuplicates.length < ingredientsRequiredNames.length) {
          let missing = ingredientsRequiredNames.filter(
            i => { return noDuplicates.map(n => { return n.name }).indexOf(i) }
          );
          console.log("missing ingredients - " + missing);
        } 
        
        // Otherwise, continue.
        else {
          let insufficientIngredientsRequiredQuantity = [];

          // Calculate if there is enough possessed quantity for each required ingredients.
          ingredientsRequired.forEach(
            i => {

              // What is required minus what is possessed.
              let shortage = i.quantity - noDuplicates.find(n => n.name === i.name).quantity
              if(shortage > 0) {
                insufficientIngredientsRequiredQuantity.push({ name: i.name, quantity: shortage })
              }
            }
          );

          // Has insufficient quantity of ingredients.
          if(insufficientIngredientsRequiredQuantity.length !== 0) {
            console.log("insufficient ingredients quantity");
            console.log(insufficientIngredientsRequiredQuantity);
          }
          
          // Otherwise, continue.
          else {
            let ingredientsPossessed = JSON.parse(JSON.stringify(items));
            
            // Sort by quantity.
            ingredientsPossessed.sort(function(a, b) { 
              return - ( a.quantity - b.quantity );
            });

            // Then sort by name.
            ingredientsPossessed.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)); 

            // Loop through ingredientsPossessed array to clash both
            // ingredientsPossessed[x].quantity and ingredientsRequired.quantity.
            for(var x=0; x < ingredientsPossessed.length; x++) {

              // possessed - required = surplus
              // 2 - 2 =  0
              // 1 - 2 = -1
              // 2 - 1 =  1
              // Deducts from ingredientsPossessed[x].quantity to calculate surplus
              let surplus = ingredientsPossessed[x].quantity -= ingredientsRequired.find(i => i.name === ingredientsPossessed[x].name).quantity;

              // Requirement is satisfied. Set requirement to 0 for next loop.
              if(surplus > 0) {
                ingredientsRequired.find(e => e.name === ingredientsPossessed[x].name).quantity = 0;
              }
              
              // Shortage. Set requirement to how much left is required for next loop.
              else {
                ingredientsRequired.find(e => e.name === ingredientsPossessed[x].name).quantity = -surplus;
                ingredientsPossessed[x].quantity = 0;
              }
 
              //console.log(surplus);
            }

            console.log(ingredientsPossessed);
            console.log("cooking");

            // Update with ingredientsPossessed. 
            //this.updateManyItem(ingredientsPossessed);
          }
        }
      }
    );
  }
}