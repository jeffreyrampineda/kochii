import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountService } from 'src/app/services/account.service';
import io from 'socket.io-client';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  private socket;
  private token = '';

  constructor(
    private messageService: MessageService,
    private accountService: AccountService
  ) { }

  initSocket(): void {
    if (this.accountService.isLoggedIn) {
      this.token = this.accountService.currentAccountValue.token;
    }
    this.socket = io(environment.socket_endpoint, {
      auth: {
        token: this.token
      },
    });
    this.socket.on('authenticated', () => {
      this.log('connection established');
    });
    this.socket.on('unauthorized', (msg) => {
      this.log(`unauthorized, ${JSON.stringify(msg.data.message)}`);
      throw new Error(msg.data.type);
    });
  }

  getSocket() {
    return this.socket;
  }

  disconnect() {
    this.socket.disconnect();
  }

  // -------------------------------------------------------------

  /**
   * Adds the message to the messageService for logging.
   * @param message - The message to log.
   */
   private log(message: string) {
    this.messageService.add(`SocketIoService: ${message}`);
  }
}
