import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { Item } from 'src/app/interfaces/item';

// -------------------------------------------------------------

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class InventoryService {

  private inventoryUrl = 'http://localhost:3001/api/inventory';
  private queryUrl = '/search/';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

// -------------------------------------------------------------

  /** Get all items. */
  getInventory(): Observable<Item[]> {
    return this.http.get<Item[]>(this.inventoryUrl)
      .pipe(
        tap(_ => this.log('fetched inventory')),
        catchError(this.handleError('getInventory', []))
      );
  }

  /**
   * Get all items with the name in the specified array.
   * @param names - The array of names to get.
   */
  getItemsByNames(names: string[]): Observable<Item[]> {
    let params = new HttpParams();
    params = params.append('names', names.join(','));

    const url = `${this.inventoryUrl}/names`;
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: params
    };

    return this.http.get<Item[]>(url, options)
      .pipe(
        tap(_ => this.log(`fetched items names=${names}`)),
        catchError(this.handleError('getItemsByNames', []))
      );
  }

  /**
   * Add the specified item.
   * @param item - The item to be added.
   */
  addItem(item: Item): Observable<Item> {
    return this.http.post<Item>(this.inventoryUrl, item, httpOptions)
      .pipe(
        tap(_ => this.log(`added item w/ id=${item._id}`)),
        catchError(this.handleError<Item>('addItem'))
      );
  }

  /**
   * Delete the item with the specified id.
   * @param _id - The id of the item to delete.
   */
  deleteItem(_id: string): Observable<any> {
    const url = `${this.inventoryUrl}/${_id}`;

    return this.http.delete(url, httpOptions)
      .pipe(
        tap(_ => this.log(`deleted item id=${_id}`)),
        catchError(this.handleError<Item>('deleteItem'))
      );
  }

  /**
   * Delete all items with the id in the specified array.
   * @param _ids - The array of ids to be deleted.
   */
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

  /**
   * Update the item with the same name and expirationDate.
   * If no item is found, create new item.
   * @param item - The item to be updated.
   * @param option - The option for updating. Can be inc, or set.
   */
  updateItem(item: Item, option: string): Observable<any> {
    const url = `${this.inventoryUrl}/${option}/${item.name}/${item.expirationDate}`;

    return this.http.put(url, item, httpOptions)
      .pipe(
        tap(_ => this.log(`updated item name=${item.name}, expirationDate=${item.expirationDate}`)),
        catchError(this.handleError<any>('updateItem'))
      );
  }

  /**
   * Search for the specified terms every 400ms.
   * @param terms - The terms used to search.
   */
  search(terms: Observable<string>) {
    return terms
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(term => this.searchEntries(term))
      );
  }

  /**
   * Search for the item with the similar name as the term.
   * @param term - The term used to search
   */
  searchEntries(term) {
    if (term !== '') {
      return this.http.get(this.inventoryUrl + this.queryUrl + term);
    }
  }

// -------------------------------------------------------------

  /**
   * Error handler used for any http errors.
   * @param operation - The type of operation used.
   * @param result - The results received.
   */
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

  /**
   * Adds the message to the messageService for logging.
   * @param message - The message to log.
   */
  private log(message: string) {
    this.messageService.add(`InventoryService: ${message}`);
  }
}
