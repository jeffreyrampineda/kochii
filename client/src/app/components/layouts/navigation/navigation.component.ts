import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountService } from 'src/app/services/account.service';
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
  notifications: string[] = [];
  accountName = '';

  constructor(
    private accountService: AccountService,
    private socketioService: SocketioService,
    private titleService: Title,
  ) {

  }

  ngOnInit() {
    this.setTitle('Overview');
    this.socketioService.initSocket();

    this.accountService.currentAccount.pipe(takeUntil(this.unsub)).subscribe({
      next: response => {
        if (response) {
          if (!response.isVerified) {
            this.notifications.unshift('Check your email to verify this account');
          }
          this.accountName = response.accountName;
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
    this.accountService.logout();
  }

  setTitle(title: string): void {
    this.titleService.setTitle(title + ' | Kochii');
  }

  toggleMobileDisplaySidebar(): void {
    this.mobileDisplaySidebar = !this.mobileDisplaySidebar;
  }
}
