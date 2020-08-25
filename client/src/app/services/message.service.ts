import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

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
  add(message: string, type: string = 'Message') {
    console.log(`[${type}] - ${message}`);
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
  notify(message: string, verticalPosition:  MatSnackBarVerticalPosition = 'top') {
    this.snackBar.open(message, 'dismiss', {
      verticalPosition,
    });
  }
}
