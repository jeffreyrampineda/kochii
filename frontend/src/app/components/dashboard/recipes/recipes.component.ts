import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';

import { Recipe } from 'src/app/interfaces/recipe';
import { RecipeService } from 'src/app/services/recipe.service';

// -------------------------------------------------------------

@Component({
  selector: 'kochii-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  displayedColumns: string[] = ['title', 'description'];
  recipes: MatTableDataSource<Recipe>;

  constructor(
    private recipeService: RecipeService
  ) { }

// -------------------------------------------------------------

  ngOnInit() {
    this.getRecipes();
  }

  /** Get all recipes and set them for presentation. */
  getRecipes(): void {
    this.recipeService.getRecipes().subscribe(
      recipes => {
        this.recipes = new MatTableDataSource(recipes);
        this.recipes.paginator = this.paginator;
      }
    );
  }

  /**
   * Filters the recipes data by the specified filterValue.
   * @param filterValue - The value to look for.
   */
  applyFilter(filterValue: string) {
    this.recipes.filter = filterValue.trim().toLowerCase();
  }
}
