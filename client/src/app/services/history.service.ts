import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

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
      );
  }

  getAllFromPastDays(days: number): Observable<History[]> {
    this.log(`fetched history records until ${days} days ago`);

    return this.http.get<History[]>(`${this.historyUrl}/${days}`)
      .pipe(
        map(result => {
          result.forEach(element => {
            element.addedDate = new Date(element.addedDate);
            element.created_at = new Date(element.created_at);
          });
          return result;
        })
      );
  }

  /** Delete all history. */
  deleteAllHistory(): Observable<any> {
    return this.http.delete(this.historyUrl)
      .pipe(
        tap(_ => this.log('deleting all history')),
      );
  }

// -------------------------------------------------------------

  /**
   * Adds the message to the messageService for logging.
   * @param message - The message to log.
   */
  private log(message: string) {
    this.messageService.add(`HistoryService: ${message}`);
  }
}
