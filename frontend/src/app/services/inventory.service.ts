import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { Item } from 'src/app/interfaces/item';
import { Group } from 'src/app/interfaces/group';

// -------------------------------------------------------------

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class InventoryService {

  private inventoryUrl = 'http://localhost:3001/api/inventory';
  private queryUrl = '/search/';
  private localInv: Item[] = [];
  private localGroups: Group[] = [];

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

// -------------------------------------------------------------

  /** Get all inventory groups. */
  getGroups(): Observable<Group[]> {
    const url = `${this.inventoryUrl}/groups`;

    return new Observable(obs => {
      if (this.localGroups.length !== 0) {
        obs.next(this.localGroups);
        return obs.complete();
      }
      this.http.get<Group[]>(url).pipe(
       tap(_ => this.log('fetched groups')),
        catchError(this.handleError('getGroups', []))
      ).subscribe(gro => {
        this.localGroups = gro;
        obs.next(this.localGroups);
        obs.complete();
      });
    });
  }

  /**
   * Get all items in the specified group.
   * @param groupName - The name of the specified group.
   */
// REMOVING - unused
/*   getItemsInGroup(groupName: string): Observable<Item[]> {
    const url = `${this.inventoryUrl}/groups/${groupName}`;

    return this.http.get<Item[]>(url)
      .pipe(
        tap(_ => this.log(`fetched items in group ${groupName}`)),
        catchError(this.handleError('getItemsInGroup', []))
      );
  } */

  /** Get all items. */
  getInventory(group: string = ''): Observable<Item[]> {
    return new Observable(obs => {
      if (this.localInv.length !== 0) {
        let filtered = this.localInv;
        if (group !== '') {
          filtered = this.localInv.filter(i => i.group === group);
        }
        obs.next(filtered);
        return obs.complete();
      }
      this.http.get<Item[]>(this.inventoryUrl).pipe(
        tap(_ => this.log('fetched inventory')),
        catchError(this.handleError('getInventory', []))
      ).subscribe(inv => {
        this.localInv = inv;
        let filtered = this.localInv;
        if (group !== '') {
          filtered = this.localInv.filter(i => i.group === group);
        }
        obs.next(filtered);
        obs.complete();
      });
    });
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
/*   addItem(item: Item): Observable<Item> {
    return this.http.post<Item>(this.inventoryUrl, item, httpOptions)
      .pipe(
        tap(_ => this.log(`added item w/ id=${item._id}`)),
        catchError(this.handleError<Item>('addItem'))
      );
  } */

  /**
   * Add the specified group.
   * @param group - The group to add.
   */
  addGroup(group: Group): Observable<Group> {
    const url = `${this.inventoryUrl}/groups`;

    return new Observable(obs => {
      this.http.post<Group>(url, group, httpOptions).pipe(
        tap(_ => this.log(`added group w/ name=${group.name}`)),
        catchError(this.handleError<Group>('addGroup'))
      ).subscribe(gro => {
        this.localGroups.push(gro);
        obs.next(gro);
        obs.complete();
      });
    });
  }

  // TODO - check if group is empty before deleting. move logic from group.component's
  // deleteGroup here.
  deleteGroup(name: string): Observable<any> {
    const url = `${this.inventoryUrl}/groups/${name}`;

    return new Observable(obs => {
      this.http.delete(url, httpOptions).pipe(
        tap(_ => this.log(`deleted group name=${name}`)),
        catchError(this.handleError<any>('deleteGroup'))
      ).subscribe(results => {
        if (results) {
          if (results.ok === 1) {
            this.localGroups = this.localGroups.filter(g => g.name !== name);
          }
        }
        obs.next(results);
        obs.complete();
      });
    });
  }

  /**
   * Delete the item with the specified id.
   * @param _id - The id of the item to delete.
   */
/*   deleteItem(_id: string): Observable<any> {
    const url = `${this.inventoryUrl}/${_id}`;

    return this.http.delete(url, httpOptions)
      .pipe(
        tap(_ => this.log(`deleted item id=${_id}`)),
        catchError(this.handleError<Item>('deleteItem'))
      );
  } */

  /**
   * Delete all items with the id in the specified array.
   * @param _ids - The array of ids to be deleted.
   */
/*   deleteManyItem(_ids: string[]): Observable<any> {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: _ids
    };

    return this.http.delete(this.inventoryUrl, options)
      .pipe(
        tap(_ => this.log(`deleted many items ids=${_ids}`)),
        catchError(this.handleError<Item>('deleteManyItem'))
      );
  } */

  /**
   * Update the item with the same name and expirationDate.
   * If no item is found, create new item.
   * @param item - The item to be updated.
   * @param option - The option for updating. Can be inc, or set.
   */
  updateItem(item: Item, option: string): Observable<any> {
    const url = `${this.inventoryUrl}/${option}/${item.name}/${item.expirationDate}`;

    // If there is id, it means that item is being updated. NOT created
    if (item._id) {
      item.prevGroup = this.localInv.find(i => i._id === item._id).group;
    }

    return new Observable(obs => {
      this.http.put(url, item, httpOptions).pipe(
        tap(_ => this.log(`updated item name=${item.name}, expirationDate=${item.expirationDate}`)),
        catchError(this.handleError<any>('updateItem'))
      ).subscribe(results => {
        if (results) {
          // If item exists.
          if (results._id) {
            // find the item in localInv
            const ref = this.localInv.find(i => i._id === results._id);
            if (ref) {
              // update old item with new value from results
              ref.name = results.name;
              ref.quantity = results.quantity;
              ref.quantityType = results.quantityType;
              ref.addedDate = results.addedDate;
              ref.expirationDate = results.expirationDate;
              ref.group = results.group;
              this.localGroups.find(g => g.name === item.prevGroup).size -= 1;
              this.localGroups.find(g => g.name === results.group).size += 1;
            } else {
              // new item. push results
              console.log('new item');
              console.log(results);
              console.log('localInv before: ');
              console.log(this.localInv);
              console.log('localGroups before: ');
              console.log(this.localGroups);
              this.localInv.push(results);
              // TODO - you add-item does not fetch for localInv. if you add items with empty localInv,
              // only the new items are pushed into the localInv, making the array not have size==0, so
              // it will not fetch data from backend.
              this.localGroups.find(g => g.name === results.group).size += 1;
            }
          } else if (results.n === 1) {
            // If item is deleted.
            this.localInv = this.localInv.filter(i => i._id !== item._id);
            this.localGroups.find(g => g.name === item.group).size -= 1;
          }
        }
        obs.next(results);
        obs.complete();
      });
    });
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
    return this.messageService.handleError<T>(operation, result);
  }

  /**
   * Adds the message to the messageService for logging.
   * @param message - The message to log.
   */
  private log(message: string) {
    this.messageService.add(`InventoryService: ${message}`);
  }
}
