import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { Group } from 'src/app/interfaces/group';

// -------------------------------------------------------------

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  private groupsUrl = 'http://localhost:3001/api/groups';
  private localGroups: Group[] = [];

  constructor(
    private http: HttpClient,
    private messageService: MessageService
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
        catchError(this.handleError('getGroups', []))
      ).subscribe(gro => {
        this.localGroups = gro;
        obs.next(this.localGroups);
        obs.complete();
      });
    });
  }

  /**
   * Add the specified group.
   * @param group - The group to add.
   */
  addGroup(group: Group): Observable<Group> {
    const url = `${this.groupsUrl}`;

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
    const url = `${this.groupsUrl}/${name}`;

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

  addLocalGroupSize(name: string, size: number): void {
    this.localGroups.find(g => g.name === name).size += size;
  }

  getLocalGroups(): Group[] {
    return this.localGroups;
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
