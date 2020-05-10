import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  private socket;

  constructor() { }

  initSocket(): void {
    this.socket = io(environment.socket_endpoint);
  }

  getSocket() {
    return this.socket;
  }
}
