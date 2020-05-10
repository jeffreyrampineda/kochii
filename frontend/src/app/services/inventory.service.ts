import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { Item } from 'src/app/interfaces/item';
import { SocketioService } from './socketio.service';

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
    private socketioService: SocketioService,
  ) { }

// -------------------------------------------------------------

  /** Get all items. */
  getItems(group: string = ''): Observable<Item[]> {
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
  createItem(item: Item): Observable<Item> {
    this.log('creating item');

    const existing = this.findItemFromLocal(item.name, item.expirationDate);

    // Change to updating
    if(existing) {
      this.log('item exists, switching to update');

      return this.updateItem(item, 'inc');
    }

    return this.http.post<Item>(this.inventoryUrl, item, httpOptions);
  }

  /**
   * Update the item with the same name and expirationDate.
   * If no item is found, create new item.
   * @param item - The item to be updated.
   * @param option - The option for updating. Can be inc, or set.
   */
  updateItem(item: Item, option: string): Observable<any> {
    this.log('updating item');
    const url = `${this.inventoryUrl}/${option}`;

    return this.http.put(url, item, httpOptions);
  }

  /**
   * Search for the specified terms every 400ms.
   * @param terms - The terms used to search.
   */
  search(terms: Observable<string>): Observable<Item[]> {
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
  searchEntries(term): Observable<Item[]> {
    if (term !== '') {
      return this.http.get<Item[]>(this.inventoryUrl + this.queryUrl + term);
    }
    return of(undefined);
  }

  getGroupSize(name) {
    return this.localInv.filter(i => i.group === name).length;
  }

// -------------------------------------------------------------

  onItemCreate() {
    return Observable.create(observer => {
      this.socketioService.getSocket().on('item_create', (item) => {
        this.log(`created - item w/ id=${item._id}`);
        this.localInv.push(item);

        observer.next(item);
      });
    });
  }

  onItemUpdate() {
    return Observable.create(observer => {
      this.socketioService.getSocket().on('item_update', (item) => {
        this.log(`updated - item w/ name=${item.name}, id=${item._id}`);
        let ite = this.localInv.find(i => i._id === item._id);

        ite.name = item.name;
        ite.quantity = item.quantity;
        ite.addedDate = item.addedDate;
        ite.expirationDate = item.expirationDate;
        ite.group = item.group;

        observer.next(item);
      });
    });
  }

  onItemUpdateMany() {
    return Observable.create(observer => {
      this.socketioService.getSocket().on('item_updateMany', (items: Item[]) => {
        if(items.length != 0) {
          this.log('updated - many item');
          items.forEach(i => {
            let ite = this.localInv.find(it => it._id === i._id);
  
            ite.group = i.group;
          });
        }
        observer.next(items);
      });
    });
  }

  onItemDelete() {
    return Observable.create(observer => {
      this.socketioService.getSocket().on('item_delete', (id) => {
        this.log(`deleted - item /w id=${id}`);
        this.localInv = this.localInv.filter(i => i._id !== id);
  
        observer.next(id);
      });
    });
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
