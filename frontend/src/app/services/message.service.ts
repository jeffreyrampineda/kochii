import { Injectable } from '@angular/core';

//-------------------------------------------------------------

@Injectable({
  providedIn: 'root',
})
export class MessageService {

  messages: string[] = [];
 
//-------------------------------------------------------------

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
}