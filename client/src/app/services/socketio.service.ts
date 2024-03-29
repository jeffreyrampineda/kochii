import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountService } from 'src/app/services/account.service';
import io, { Socket } from 'socket.io-client';
import { MessageService } from './message.service';
import { DefaultEventsMap } from '@socket.io/component-emitter';

@Injectable({
  providedIn: 'root',
})
export class SocketioService {
  private socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;
  private token = '';
  private socketUrl = `${environment.domain}/`;

  constructor(
    private messageService: MessageService,
    private accountService: AccountService
  ) {}

  initSocket(): void {
    if (this.accountService.isLoggedIn) {
      this.token = this.accountService.currentAccountValue.token ?? '';
    }
    this.socket = io(this.socketUrl, {
      extraHeaders: {
        Authorization: `Bearer ${this.token}`,
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
    this.socket?.disconnect();
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
