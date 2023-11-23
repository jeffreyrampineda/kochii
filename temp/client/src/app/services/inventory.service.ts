import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import {
  tap,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs/operators';

import { MessageService } from './message.service';
import { Item } from '../interfaces/item';
import { SocketioService } from './socketio.service';

// -------------------------------------------------------------

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private inventoryUrl = `${environment.domain}/api/inventory`;
  private groupsUrl = `${environment.domain}/api/groups`;
  private queryUrl = `${environment.domain}/search/`;
  private localInv: Item[] = [];
  private localGroups: string[] = [];
  private isSocketListenerSet = false;

  public inventoryUpdate = new Subject<void>();
  public groupsUpdate = new Subject<void>();
  public selectedGroup = '';

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private socketioService: SocketioService
  ) {}

  // -------------------------------------------------------------

  /** Set socket listeners once */
  setSocketListeners() {
    if (!this.isSocketListenerSet) {
      this.log('setting socket listeners');
      this.onItemCreate();
      this.onItemUpdate();
      this.onItemUpdateMany();
      this.onItemDelete();

      this.onGroupCreate();
      this.onGroupDelete();

      this.isSocketListenerSet = true;
    }
  }

  /** Get all items. */
  getItems(group: string = ''): Observable<Item[]> {
    return new Observable((obs) => {
      this.selectedGroup = group;
      if (this.localInv.length !== 0) {
        let filtered = this.localInv;
        if (group !== '') {
          filtered = this.localInv.filter((i) => i.group === group);
        }
        obs.next(filtered);
        return obs.complete();
      }
      this.http
        .get<Item[]>(this.inventoryUrl)
        .pipe(tap(() => this.log('fetched inventory')))
        .subscribe({
          next: (response) => {
            this.localInv = response;
            let filtered = this.localInv;
            if (group !== '') {
              filtered = this.localInv.filter((i) => i.group === group);
            }
            obs.next(filtered);
          },
          error: (err) => {
            obs.error(err);
          },
          complete: () => {
            obs.complete();
          },
        });
    });
  }

  getItemById(id: string): Observable<Item> {
    this.log(`fetched item /w id=${id}`);
    const url = `${this.inventoryUrl}/${id}`;

    return this.http.get<Item>(url);
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
      params: params,
    };

    return this.http
      .get<Item[]>(url, options)
      .pipe(tap(() => this.log(`fetched items names=${names}`)));
  }

  getItemsAddedBetween(startDate: string, endDate: string): Observable<Item[]> {
    this.log(`fetched items added between=${startDate}, ${endDate}`);
    const url = `${this.inventoryUrl}/between`;
    const options = {
      headers: httpOptions.headers,
      params: {
        startDate,
        endDate,
      },
    };

    return this.http.get<Item[]>(url, options);
  }

  /**
   * Add the specified item.
   * @param item - The item to be added.
   */
  createItem(item: Item): Observable<Item> {
    this.log('creating item');

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
  search(terms: Observable<string>): Observable<Item[] | undefined> {
    return terms.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchEntries(term))
    );
  }

  /**
   * Search for the item with the similar name as the term.
   * @param term - The term used to search
   */
  searchEntries(term: string): Observable<Item[] | undefined> {
    if (term !== '') {
      return this.http.get<Item[]>(this.inventoryUrl + this.queryUrl + term);
    }
    return of(undefined);
  }

  getNutrients(query: string): Observable<{ description: string }[]> {
    this.log('getting nutrients for: ' + query);
    const url = `${this.inventoryUrl}/nutrition?query=${query}`;

    return this.http.get<{ description: string }[]>(url);
  }

  /** Returns the size of the specified group. */
  getGroupSize(group: string = ''): number {
    if (group !== '') {
      return this.localInv.filter((i) => i.group === group).length;
    }
    return this.localInv.length;
  }

  /** Get all groups. */
  getGroups(): Observable<string[]> {
    const url = `${this.groupsUrl}`;

    return new Observable((obs) => {
      if (this.localGroups.length !== 0) {
        obs.next(this.localGroups);
        return obs.complete();
      }
      this.http
        .get<string[]>(url)
        .pipe(tap(() => this.log('fetched groups')))
        .subscribe({
          next: (response) => {
            this.localGroups = response;
            obs.next(this.localGroups);
          },
          error: (err) => {
            obs.error(err);
          },
          complete: () => {
            obs.complete();
          },
        });
    });
  }

  /**
   * Add the specified group.
   * @param group - The group to add.
   */
  createGroup(name: string): Observable<any> {
    this.log('creating group');
    const url = `${this.groupsUrl}/${name}`;

    return this.http.post<any>(url, null, httpOptions);
  }

  /**
   * Deletes the group from the server.
   * @param name - The name of the group to be deleted.
   */
  deleteGroup(name: string): Observable<Item> {
    this.log('deleting group');
    const url = `${this.groupsUrl}/${name}`;

    return this.http.delete<Item>(url, httpOptions);
  }

  // -------------------------------------------------------------

  onItemCreate() {
    this.socketioService.getSocket()?.on('item_create', (item) => {
      this.log(`created - item w/ id=${item._id}`);
      this.localInv.unshift(item);
      this.inventoryUpdate.next();
    });
  }

  onItemUpdate() {
    this.socketioService.getSocket()?.on('item_update', (item) => {
      this.log(`updated - item w/ name=${item.name}, id=${item._id}`);
      const ite = this.localInv.find((i) => i._id === item._id);
      if (ite) {
        ite.name = item.name;
        ite.quantity = item.quantity;
        ite.cost = item.cost;
        ite.addedDate = item.addedDate;
        ite.expirationDate = item.expirationDate;
        ite.group = item.group;
      }
      this.inventoryUpdate.next();
    });
  }

  onItemUpdateMany() {
    this.socketioService.getSocket()?.on('item_updateMany', (items: Item[]) => {
      if (items.length !== 0) {
        this.log('updated - many item');
        items.forEach((i) => {
          const ite = this.localInv.find((it) => it._id === i._id);
          if (ite) {
            ite.group = i.group;
          }
        });
      }
      this.inventoryUpdate.next();
    });
  }

  onItemDelete() {
    this.socketioService.getSocket()?.on('item_delete', (id) => {
      this.log(`deleted - item /w id=${id}`);
      this.localInv = this.localInv.filter((i) => i._id !== id);
      this.inventoryUpdate.next();
    });
  }

  onGroupCreate() {
    this.socketioService.getSocket()?.on('group_create', (group: string) => {
      this.log(`created - group /w name=${group}`);
      this.localGroups.push(group);
      this.groupsUpdate.next();
    });
  }

  onGroupDelete() {
    this.socketioService.getSocket()?.on('group_delete', (group: string) => {
      this.log(`deleted - group /w name=${group}`);
      this.localGroups = this.localGroups.filter((g) => g !== group);
      this.groupsUpdate.next();
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
}
