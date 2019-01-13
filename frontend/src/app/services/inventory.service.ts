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
        tap(_ => this.log('fetched inventory')),
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

  deleteItem(_id: string): Observable<any> {
    const url = `${this.inventoryUrl}/${_id}`;
 
    return this.http.delete(url, httpOptions)
      .pipe(
        tap(_ => this.log(`deleted item id=${_id}`)),
        catchError(this.handleError<Item>('deleteItem'))
      );
  }

  // Check if this item exists(same name, expiration).
  // If exists, update (combine quantity), otherwise, create.
  upsertItem(item: Item): Observable<any> {
    const url = `${this.inventoryUrl}/${item.name}/${item.expirationDate}`;

    return this.http.put<Item>(url, item, httpOptions).pipe(
      tap(_ => this.log(`upsert item name=${item.name}, expirationDate=${item.expirationDate}`)),
      catchError(this.handleError<any>('upsertItem'))
    );
  }

  deleteManyItem(_ids: string[]): Observable<any> {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: _ids
    };

    return this.http.delete(this.inventoryUrl, options)
      .pipe(
        tap(_ => this.log(`deleted many items ids=${_ids}`)),
        catchError(this.handleError<Item>('deleteManyItem'))
      );
  }

  updateItem(item: Item): Observable<any> {
    const url = `${this.inventoryUrl}/${item._id}`;

    return this.http.put(url, item, httpOptions)
      .pipe(
        tap(_ => this.log(`updated item id=${item._id}`)),
        catchError(this.handleError<any>('updateItem'))
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
