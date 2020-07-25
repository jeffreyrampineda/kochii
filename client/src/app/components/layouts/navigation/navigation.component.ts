import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'kochii-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', { static: true }) sidenav: ElementRef;

  private unsub = new Subject<void>();

  showNotification: boolean;
  notifications: string[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private socketioService: SocketioService
  ) {

  }

  ngOnInit() {
    this.socketioService.initSocket();

    this.authenticationService.currentUser.pipe(takeUntil(this.unsub)).subscribe({
      next: response => {
        if (response && !response.isVerified) {
          this.notifications.unshift('Check your email to verify this account');
        }
      },
      error: () => {

      },
      complete: () => {

      }
    });
  }

  ngOnDestroy(): void {
    this.unsub.next();
    this.unsub.complete();
  }

  openNotification(state: boolean) {
    this.showNotification = state;
  }

  logout(): void {
    this.socketioService.disconnect();
    this.authenticationService.logout();
  }
}