import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';

import { Observable, of } from 'rxjs';
import { catchError, tap, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { ItemInstance } from '../interfaces/item-instance';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class InventoryService {

  private inventoryUrl = 'api/inventory';
  private queryUrl: string = '/?name=^';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getInventory(): Observable<ItemInstance[]> {
    return this.http.get<ItemInstance[]>(this.inventoryUrl)
      .pipe(
        tap(_ => console.log('fetched inventory')),
        catchError(this.handleError('getInventory', []))
      )
  }

  addItem (item: ItemInstance): Observable<ItemInstance> {
    return this.http.post<ItemInstance>(this.inventoryUrl, item, httpOptions).pipe(
      tap((item: ItemInstance) => this.log(`added item w/ id=${item.id}`)),
      catchError(this.handleError<ItemInstance>('addItem'))
    );
  }

  search(terms: Observable<string>) {
    return terms
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(term => this.searchEntries(term))
      )
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
