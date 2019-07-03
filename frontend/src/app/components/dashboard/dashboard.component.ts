import { Component, OnInit, HostListener } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { MessageService } from 'src/app/services/message.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

// -------------------------------------------------------------

@Component({
  selector: 'kochii-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
    trigger('openClose', [
      state('open', style({
        '-webkit-transform': 'translate(135%, 260%) rotate(-90deg)',
        'transform': 'translate(-85%, 162%) rotate(-90deg)',  // Y: 162% to match with content's top
        'opacity': '1'
      })),
      state('closed', style({
        '-webkit-transform': 'translate(210%, 260%) rotate(-90deg)',
        'transform': 'translate(-10%, 162%) rotate(-90deg)',  // Y: 162% to match with content's top
      })),
      transition('open => closed', [
        animate('0.1s')
      ]),
      transition('closed => open', [
        animate('0.1s')
      ]),
    ]),
  ],
})
export class DashboardComponent implements OnInit {
  opened = true;

  constructor(
    private authenticationService: AuthenticationService,
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

  logout(): void {
    this.authenticationService.logout();
  }
}
