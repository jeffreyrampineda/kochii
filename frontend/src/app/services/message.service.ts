import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

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
