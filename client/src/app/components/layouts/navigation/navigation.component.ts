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

  clicked: boolean;
  notifications: string[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private socketioService: SocketioService
  ) {
    this.clicked = this.clicked === undefined ? false : true;
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

  setClicked(val: boolean): void {
    this.clicked = val;
  }

  logout(): void {
    this.socketioService.disconnect();
    this.authenticationService.logout();
  }
}
