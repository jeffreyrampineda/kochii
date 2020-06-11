import { Component, OnInit, HostListener, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SocketioService } from 'src/app/services/socketio.service';
import { MediaMatcher } from '@angular/cdk/layout';

// -------------------------------------------------------------

@Component({
  selector: 'kochii-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private _mobileQueryListener: () => void;
  opened = true;
  mobileQuery: MediaQueryList;

  constructor(
    private authenticationService: AuthenticationService,
    private socketioService: SocketioService,
    private messageSevice: MessageService,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 768px)');
    this._mobileQueryListener = () => {
      changeDetectorRef.detectChanges();
      this.opened = !this.mobileQuery.matches;
    };
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  // -------------------------------------------------------------

  ngOnInit() {
    this.socketioService.initSocket();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
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

  get isVerified(): boolean {
    return this.authenticationService.currentUserValue.isVerified;
  }
}
