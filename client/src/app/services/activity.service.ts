import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { MessageService } from './message.service';
import { Activity } from 'src/app/interfaces/activity';

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
    tap(() => this.log(`fetched activities records until ${days} days ago`));

    return this.http.get<Activity[]>(`${this.activitiesUrl}/${days}`).pipe(
      map((result) => {
        result.forEach((element) => {
          element.addedDate = new Date(element.addedDate);
          element.created_at = new Date(element.created_at);
        });
        return result;
      })
    );
  }

  /** Delete all activities. */
  clearActivities(): Observable<any> {
    return this.http
      .delete(this.activitiesUrl)
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
