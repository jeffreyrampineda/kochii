import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { History } from 'src/app/interfaces/history';

// -------------------------------------------------------------

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private historyUrl = '/api/history';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

// -------------------------------------------------------------

  /** Get all history. */
  getHistory(): Observable<History[]> {
    return this.http.get<History[]>(this.historyUrl)
      .pipe(
        tap(_ => this.log('fetched history')),
        catchError(this.handleError('getHistory', []))
      );
  }

  /** Delete all history. */
  deleteAllHistory(): Observable<any> {
    return this.http.delete(this.historyUrl)
      .pipe(
        tap(_ => this.log('deleting all history')),
        catchError(this.handleError<History>('deleteAllHistory'))
      );
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
    this.messageService.add(`HistoryService: ${message}`);
  }
}
