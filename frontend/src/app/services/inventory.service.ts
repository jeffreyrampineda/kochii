import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { GroupsService } from './groups.service';
import { Item } from 'src/app/interfaces/item';

// -------------------------------------------------------------

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class InventoryService {

  private inventoryUrl = '/api/inventory';
  private queryUrl = '/search/';
  private localInv: Item[] = [];

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private groupsService: GroupsService,
  ) { }

// -------------------------------------------------------------

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
      ).subscribe({
        next: response => {
          this.localInv = response;
          let filtered = this.localInv;
          if (group !== '') {
            filtered = this.localInv.filter(i => i.group === group);
          }
          obs.next(filtered);
        },
        error: err => {
          obs.error(err);
        },
        complete: () => {
          obs.complete();
        }
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
      );
  }

  /**
   * Add the specified item.
   * @param item - The item to be added.
   */
  addItem(item: Item): Observable<Item> {
    this.log('adding item');

    const existing = this.findItemFromLocal(item.name, item.expirationDate);

    // Change to updating
    if(existing) {
      this.log('item exists, switching to update');

      return this.updateItem(item, 'inc');
    }

    return new Observable(obs => {
      this.http.post<Item>(this.inventoryUrl, item, httpOptions).pipe(
        tap(_ => this.log(`added item w/ id=${item._id}`)),
      ).subscribe({
        next: response => {
          if(response) {
            this.log('success - item is created');
  
            this.localInv.push(response);
            // TODO - you add-item does not fetch for localInv. if you add items with empty localInv,
            // only the new items are pushed into the localInv, making the array not have size==0, so
            // it will not fetch data from backend.
            this.groupsService.addLocalGroupSize(response.group, 1);
          }
          obs.next(response);
        },
        error: err => {
          obs.error(err);
        },
        complete: () => {
          obs.complete();
        }
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
      );
  } */

  /**
   * Update the item with the same name and expirationDate.
   * If no item is found, create new item.
   * @param item - The item to be updated.
   * @param option - The option for updating. Can be inc, or set.
   */
  updateItem(item: Item, option: string): Observable<any> {
    this.log('updating item');
    const url = `${this.inventoryUrl}/${option}/${item.name}/${item.expirationDate}`;

    // Returns item if exists, otherwise null.
    const existing = this.findItemFromLocal(item.name, item.expirationDate);
  
    if (existing) {
      item.prevGroup = existing.group;
    } else {
      throw new Error("updating non-existing item");
    }

    return new Observable(obs => {
      this.http.put(url, item, httpOptions).pipe(
        tap(_ => this.log(`updated item name=${item.name}, expirationDate=${item.expirationDate}`)),
      ).subscribe({
        next: (response: any) => {
          if (response) {
            // If item was returned.
            if (response._id) {
  
              // update old item with new value from response
              this.log('success - item is updated');
              
              existing.name = response.name;
              existing.quantity = response.quantity;
              existing.addedDate = response.addedDate;
              existing.expirationDate = response.expirationDate;
              existing.group = response.group;
              this.groupsService.addLocalGroupSize(item.prevGroup, -1);
              this.groupsService.addLocalGroupSize(response.group, 1);
            } else if (response.n === 1) {
  
              // If item is deleted.
              this.log('success - item is deleted');
              this.localInv = this.localInv.filter(i => i._id !== existing._id);
              this.groupsService.addLocalGroupSize(item.group, -1);
            }
          }
          obs.next(response);
        },
        error: err => {
          obs.error(err);
        },
        complete: () => {
          obs.complete();
        }
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
   * Adds the message to the messageService for logging.
   * @param message - The message to log.
   */
  private log(message: string) {
    this.messageService.add(`InventoryService: ${message}`);
  }

  private findItemFromLocal(name: string, expirationDate: Date): Item {
    const item = this.localInv.find(i => i.name === name);

    if (item) {
      // If expiration dates are the same, item is the same.
      const compareDates = new Date(item.expirationDate).getTime() - new Date(expirationDate).getTime();
      if (compareDates === 0) {
        return item;
      }
    }
    return null;
  }
}
