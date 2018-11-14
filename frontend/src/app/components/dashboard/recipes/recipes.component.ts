import { Component, OnInit } from '@angular/core';
import { Recipe } from 'src/app/interfaces/recipe';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {

  recipes: Recipe[];

  constructor(private recipeService: RecipeService) {
    this.recipes = []
  }

  ngOnInit() {
    this.getRecipes()
  }

  getRecipes(): void {
    this.recipeService.getRecipes()
        .subscribe(recipes => this.recipes = recipes);
}
}
