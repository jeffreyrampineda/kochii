import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';

import { Observable, of } from 'rxjs';
import { catchError, tap, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Item } from '../interfaces/item';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class InventoryService {

  private inventoryUrl = 'http://localhost:3001/api/inventory';
  private queryUrl: string = '/search/';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getInventory(): Observable<Item[]> {
    return this.http.get<Item[]>(this.inventoryUrl)
      .pipe(
        tap(_ => console.log('fetched inventory')),
        catchError(this.handleError('getInventory', []))
      );
  }

  addItem(item: Item): Observable<Item> {
    return this.http.post<Item>(this.inventoryUrl, item, httpOptions)
      .pipe(
        tap((item: Item) => this.log(`added item w/ id=${item._id}`)),
        catchError(this.handleError<Item>('addItem'))
      );
  }

  search(terms: Observable<string>) {
    return terms
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(term => this.searchEntries(term))
      );
  }

  searchEntries(term) {
    if(term != "") {
      return this.http.get(this.inventoryUrl + this.queryUrl + term);
    }
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
    this.messageService.add(`InventoryService: ${message}`);
  }
}
