import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material';

// -------------------------------------------------------------

@Injectable({
  providedIn: 'root',
})
export class MessageService {

  messages: string[] = [];

  constructor(
    private snackBar: MatSnackBar,
  ) { }

// -------------------------------------------------------------

  /**
   * Add the message to the messages array.
   * @param message - The message received.
   */
  add(message: string) {
    console.log(`[Message] - ${message}`);
    this.messages.push(message);
  }

  /** Clears the messages array. */
  clear() {
    this.messages = [];
  }

  /**
   * TODO: Check security - private vs public.
   *
   * Error handler used for any http errors.
   * @param operation - The type of operation used.
   * @param result - The results received.
   */
  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.add(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /**
   * This method opens a MatSnackBar notification.
   * @param message - The message to be displayed.
   */
  notify(message: string, verticalPositionp: any = 'top') {
    this.snackBar.open(message, 'dismiss', {
      verticalPosition: verticalPositionp,
      horizontalPosition: 'center',
    });
  }
}
