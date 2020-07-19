import { Component, OnInit, HostListener } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';

// -------------------------------------------------------------

@Component({
  selector: 'kochii-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private messageSevice: MessageService,
  ) { }

  // -------------------------------------------------------------

  ngOnInit() {

  }

  @HostListener('window:online', ['$event'])
  private openOnlineNotification() {
    this.messageSevice.notify('Internet is back ;D');
  }

  @HostListener('window:offline', ['$event'])
  private openOfflineNotification() {
    this.messageSevice.notify('Connection Lost!');
  }
}
