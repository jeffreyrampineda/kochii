import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { SocketioService } from './socketio.service';

// -------------------------------------------------------------

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  private groupsUrl = '/api/groups';
  private localGroups: string[] = [];
  private isSocketListenerSet = false;

  public groupsUpdate = new Subject<void>();

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private socketioService: SocketioService,
  ) { }

  /** Set socket listeners once */
  setSocketListeners() {
    if (!this.isSocketListenerSet) {
      this.log('setting socket listeners');
      this.onGroupCreate();
      this.onGroupDelete();
      this.isSocketListenerSet = true;
    }
  }

  /** Get all groups. */
  getGroups(): Observable<string[]> {
    const url = `${this.groupsUrl}`;

    return new Observable(obs => {
      if (this.localGroups.length !== 0) {
        obs.next(this.localGroups);
        return obs.complete();
      }
      this.http.get<string[]>(url).pipe(
        tap(_ => this.log('fetched groups')),
      ).subscribe({
        next: response => {
          this.localGroups = response;
          obs.next(this.localGroups);
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
  deleteGroup(name: string): Observable<any> {
    this.log('deleting group');
    const url = `${this.groupsUrl}/${name}`;

    return this.http.delete<any>(url, httpOptions);
  }

  // -------------------------------------------------------------

  onGroupCreate() {
    this.socketioService.getSocket().on('group_create', (group: string) => {
      this.log(`created - group /w name=${group}`);
      this.localGroups.push(group);
      this.groupsUpdate.next();
    });
  }

  onGroupDelete() {
    this.socketioService.getSocket().on('group_delete', (group: string) => {
      this.log(`deleted - group /w name=${group}`);
      this.localGroups = this.localGroups.filter(g => g !== group);
      this.groupsUpdate.next();
    });
  }

  // -------------------------------------------------------------

  /**
   * Adds the message to the messageService for logging.
   * @param message - The message to log.
   */
  private log(message: string) {
    this.messageService.add(`GroupsService: ${message}`);
  }
}
