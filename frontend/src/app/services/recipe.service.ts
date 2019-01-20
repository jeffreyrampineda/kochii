import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { Recipe } from 'src/app/interfaces/recipe';

// -------------------------------------------------------------

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private recipesUrl = 'http://localhost:3001/api/recipes';

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
        catchError(this.handleError('getRecipes', []))
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
        catchError(this.handleError<Recipe>(`getRecipeById id=${_id}`))
      );
  }

// -------------------------------------------------------------

  /**
   * Error handler used for any http errors.
   * @param operation - The type of operation used.
   * @param result - The results received.
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return this.messageService.handleError<T>(operation, result);
  }

  /**
   * Adds the message to the messageService for logging.
   * @param message - The message to log.
   */
  private log(message: string) {
    this.messageService.add(`RecipeService: ${message}`);
  }
}
