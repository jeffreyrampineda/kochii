import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountService } from 'src/app/services/account.service';
import io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  private socket;
  private token = '';

  constructor(
    private accountService: AccountService
  ) { }

  initSocket(): void {
    if (this.accountService.isLoggedIn) {
      this.token = this.accountService.currentUserValue.token;
    }
    this.socket = io(environment.socket_endpoint);
    this.socket.emit('authenticate', { token: this.token });
    this.socket.on('authenticated', () => {
      // console.log('auth');
    });
    this.socket.on('unauthorized', (msg) => {
      console.log(`unauthorized: ${JSON.stringify(msg.data.message)}`);
      throw new Error(msg.data.type);
    });
  }

  getSocket() {
    return this.socket;
  }

  disconnect() {
    this.socket.disconnect();
  }
}
