import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Recipe } from '../interfaces/recipe';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private recipesUrl = 'http://localhost:3001/api/recipes';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.recipesUrl)
      .pipe(
        tap(_ => console.log('fetched recipes')),
        catchError(this.handleError('getRecipes', []))
      )
  }

  getRecipeById(id): Observable<Recipe> {
    return this.http.get<Recipe>(this.recipesUrl + `/id/${id}`)
      .pipe(
        tap(_ => console.log(`fetched recipe id=${id}`)),
        catchError(this.handleError<Recipe>(`getRecipeById id=${id}`))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`RecipeService: ${message}`);
  }
}
