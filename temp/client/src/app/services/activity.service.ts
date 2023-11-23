import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { MessageService } from './message.service';
import { Activity } from '../interfaces/activity';

// -------------------------------------------------------------

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private activitiesUrl = `${environment.domain}/api/activities`;

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  // -------------------------------------------------------------

  /** Get all activities. */
  getActivities(): Observable<Activity[]> {
    return this.http
      .get<Activity[]>(this.activitiesUrl)
      .pipe(tap(() => this.log('fetched activities')));
  }

  getAllFromPastDays(days: number): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.activitiesUrl}/${days}`).pipe(
      map((result) => {
        result.forEach((element) => {
          element.addedDate = new Date(element.addedDate);
          element.created_at = new Date(element.created_at);
        });
        return result;
      }),
      tap(() => this.log(`fetched activities records until ${days} days ago`))
    );
  }

  /** Delete all activities. */
  clearActivities(): Observable<number> {
    return this.http
      .delete<number>(this.activitiesUrl)
      .pipe(tap(() => this.log('deleting all activities')));
  }

  // -------------------------------------------------------------

  /**
   * Adds the message to the messageService for logging.
   * @param message - The message to log.
   */
  private log(message: string) {
    this.messageService.add(`ActivityService: ${message}`);
  }
}
