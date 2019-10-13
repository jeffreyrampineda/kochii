import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { Recipe } from 'src/app/interfaces/recipe';

// -------------------------------------------------------------

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private recipesUrl = '/api/recipes';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

// -------------------------------------------------------------

  /** Get all recipes. */
  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.recipesUrl)
      .pipe(
        tap(_ => this.log('fetched recipes')),
      );
  }

  /**
   * Get the recipe with the specified id.
   * @param _id - The id of the recipe.
   */
  getRecipeById(_id: string): Observable<Recipe> {
    return this.http.get<Recipe>(this.recipesUrl + `/id/${_id}`)
      .pipe(
        tap(_ => this.log(`fetched recipe id=${_id}`)),
      );
  }

// -------------------------------------------------------------

  /**
   * Adds the message to the messageService for logging.
   * @param message - The message to log.
   */
  private log(message: string) {
    this.messageService.add(`RecipeService: ${message}`);
  }
}
