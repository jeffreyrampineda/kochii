import { Component, OnInit, ViewChild } from '@angular/core';
import { Recipe } from 'src/app/interfaces/recipe';
import { RecipeService } from 'src/app/services/recipe.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['name', 'description'];
  recipes: MatTableDataSource<Recipe>;

  constructor(
    private recipeService: RecipeService
  ) { }

  ngOnInit() {
    this.getRecipes()
  }

  getRecipes(): void {
    this.recipeService.getRecipes().subscribe(
      recipes => {
        this.recipes = new MatTableDataSource(recipes);
        this.recipes.paginator = this.paginator;
      }
    );
  }

  applyFilter(filterValue: string) {
    this.recipes.filter = filterValue.trim().toLowerCase();
  }
}
