import { Component, HostListener } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';

// -------------------------------------------------------------

@Component({
  selector: 'kochii-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  constructor(private messageSevice: MessageService) {}

  @HostListener('window:online', ['$event'])
  private openOnlineNotification() {
    this.messageSevice.notify('Internet is back ;D');
  }

  @HostListener('window:offline', ['$event'])
  private openOfflineNotification() {
    this.messageSevice.notify('Connection Lost!');
  }
}
