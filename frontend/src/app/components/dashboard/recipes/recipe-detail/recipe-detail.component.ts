import { Component, OnInit, Input, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RecipeService } from 'src/app/services/recipe.service';
import { Recipe } from 'src/app/interfaces/recipe';
import { InventoryService } from 'src/app/services/inventory.service';
import { Item } from 'src/app/interfaces/item';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// -------------------------------------------------------------

@Component({
  selector: 'kochii-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  @Input() recipe: Recipe;

  constructor(
    private route: ActivatedRoute,
    private inventoryService: InventoryService,
    private recipeService: RecipeService,
    private location: Location,
    public dialog: MatDialog
  ) { }

// -------------------------------------------------------------

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
        this.recipe = recipe;
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
    const observablesGroup = [];

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

  // TODO: Simplify.
  /**
   * Checks if inventory have enough of the required ingredients.
   * If enough is available, deduct the required ingredients' quantity
   * from the inventory. Otherwise, show the missing ingredients.
   */
  cook(): void {
    const ingredientsRequired = JSON.parse(JSON.stringify(this.recipe.ingredients));
    const ingredientsRequiredNames = ingredientsRequired.map(e => e.name);

    this.inventoryService.getItemsByNames(ingredientsRequiredNames).subscribe(
      items => {
        // console.log(items);

        let noDuplicates: any = [];
        // let duplicates: any = [];

        // Has duplicate due to different expirationDates.
        if (items.length > ingredientsRequired.length) {
          items.forEach(
            i => {

              // Try to find if item 'i's name exists in noDuplicate.
              const notUnique = noDuplicates.find(n => n.name === i.name && n._id !== i._id);

              // Item 'i's name already exists, append 'i's quantity to the existing item in noDuplicate instead.
              if (notUnique) {
                notUnique.quantity += i.quantity;
                // duplicates.push(JSON.parse(JSON.stringify(i)));
              } else {
                // Otherwise, item 'i's name is unique. Push to noDuplicate.
                noDuplicates.push(JSON.parse(JSON.stringify(i)));
              }
            }
          );

          // console.log(duplicates);
          // console.log(noDuplicates);
        } else {
          // Otherwise, there are no duplicates.
          noDuplicates = JSON.parse(JSON.stringify(items));
        }

        // Has missing ingredients.
        if (noDuplicates.length < ingredientsRequired.length) {
          const missing = ingredientsRequired.filter(
            i => noDuplicates.map(n => n.name).indexOf(i.name)
          );

          this.openCookDialog(false, missing);
        } else {
          // Otherwise, continue.
          const insufficientIngredientsRequiredQuantity = [];

          // Calculate if there is enough possessed quantity for each required ingredients.
          ingredientsRequired.forEach(
            i => {

              // What is required minus what is possessed.
              const shortage = i.quantity - noDuplicates.find(n => n.name === i.name).quantity;
              if (shortage > 0) {
                insufficientIngredientsRequiredQuantity.push({ name: i.name, quantity: shortage });
              }
            }
          );

          // Has insufficient quantity of ingredients.
          if (insufficientIngredientsRequiredQuantity.length !== 0) {
            console.log('insufficient ingredients quantity');
            console.log(insufficientIngredientsRequiredQuantity);
            this.openCookDialog(false, insufficientIngredientsRequiredQuantity);
          } else {
            // Otherwise, continue.
            const ingredientsPossessed = JSON.parse(JSON.stringify(items));

            // Sort by quantity.
            ingredientsPossessed.sort(function(a, b) {
              return - ( a.quantity - b.quantity );
            });

            // Then sort by name.
            ingredientsPossessed.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

            // Loop through ingredientsPossessed array to clash both
            // ingredientsPossessed[x].quantity and ingredientsRequired.quantity.
            for (let x = 0; x < ingredientsPossessed.length; x++) {

              // possessed - required = surplus
              // 2 - 2 =  0
              // 1 - 2 = -1
              // 2 - 1 =  1
              // Deducts from ingredientsPossessed[x].quantity to calculate surplus
              const surplus = ingredientsPossessed[x].quantity -= ingredientsRequired
                .find(i => i.name === ingredientsPossessed[x].name).quantity;

              // Requirement is satisfied. Set requirement to 0 for next loop.
              if (surplus > 0) {
                ingredientsRequired.find(e => e.name === ingredientsPossessed[x].name).quantity = 0;
              } else {
                // Shortage. Set requirement to how much left is required for next loop.
                ingredientsRequired.find(e => e.name === ingredientsPossessed[x].name).quantity = -surplus;
                ingredientsPossessed[x].quantity = 0;
              }

              // console.log(surplus);
            }

            console.log(ingredientsPossessed);
            this.openCookDialog(true, ingredientsPossessed);
          }
        }
      }
    );
  }

  /** Opens the cook dialog. */
  openCookDialog(canCook: boolean, items: Item[]): void {
    const dialogRef = this.dialog.open(CookDialogComponent, {
      width: '250px',
      data: {
        title: this.recipe.title,
        canCook: canCook,
        ingredients: items
      }
    });

    // Confirmed.
    dialogRef.afterClosed().subscribe(
      result => {
        if (result && result.length > 0) {
          console.log('Cooking');
          // TODO: Update with result.
          // this.updateManyItem(result);
        }
      }
    );
  }
}

// -------------------------------------------------------------

// TODO: Generalize dialog to be reusable.
@Component({
  selector: 'kochii-cook-dialog',
  templateUrl: 'cook-dialog.component.html',
})
export class CookDialogComponent {

  constructor(
      public dialogRef: MatDialogRef<CookDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { canCook: boolean, items: Item[] },
  ) { }

// -------------------------------------------------------------

  /** Close this dialog without sending data. */
  onNoClick(): void {
      this.dialogRef.close();
  }
}
