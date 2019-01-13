import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { RecipeService } from 'src/app/services/recipe.service';
import { Recipe } from 'src/app/interfaces/recipe';

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
}
