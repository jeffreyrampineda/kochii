import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { Group } from 'src/app/interfaces/group';
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
  private localGroups: Group[] = [];

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private socketioService: SocketioService,
  ) { }

  /** Get all groups. */
  getGroups(): Observable<Group[]> {
    const url = `${this.groupsUrl}`;

    return new Observable(obs => {
      if (this.localGroups.length !== 0) {
        obs.next(this.localGroups);
        return obs.complete();
      }
      this.http.get<Group[]>(url).pipe(
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
  createGroup(name: string): Observable<Group> {
    this.log('creating group');
    const url = `${this.groupsUrl}/${name}`;

    return this.http.post<Group>(url, null, httpOptions);
  }

  // TODO - check if group is empty before deleting. move logic from group.component's
  // deleteGroup here.
  deleteGroup(name: string): Observable<any> {
    this.log('deleting group');
    const url = `${this.groupsUrl}/${name}`;

    return this.http.delete(url, httpOptions);
  }

// -------------------------------------------------------------

  onGroupCreate() {
    return Observable.create(observer => {
      this.socketioService.getSocket().on('group_create', (group) => {
        this.log(`created - group /w name=${group.name}`);
        this.localGroups.push(group);
        observer.next(group);
      });
    });
  }

  onGroupDelete() {
    return Observable.create(observer => {
      this.socketioService.getSocket().on('group_delete', (name) => {
        this.log(`deleted - group /w name=${name}`);
        this.localGroups = this.localGroups.filter(g => g.name !== name);
        observer.next(name);
      });
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
