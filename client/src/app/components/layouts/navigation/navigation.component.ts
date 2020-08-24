import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SocketioService } from 'src/app/services/socketio.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'kochii-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', { static: true }) sidenav: ElementRef;

  private unsub = new Subject<void>();
  mobileDisplaySidebar = false;

  imgBanner = '//www.kochii.app/kochii-banner.png';
  notifications: string[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private socketioService: SocketioService,
    private titleService: Title,
  ) {

  }

  ngOnInit() {
    this.setTitle('Overview');
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

  logout(): void {
    this.socketioService.disconnect();
    this.authenticationService.logout();
  }

  setTitle(title: string): void {
    this.titleService.setTitle(title + ' | Kochii');
  }

  toggleMobileDisplaySidebar(): void {
    this.mobileDisplaySidebar = !this.mobileDisplaySidebar;
  }
}
