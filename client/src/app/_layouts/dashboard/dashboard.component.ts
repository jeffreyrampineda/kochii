import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';
import { AccountService } from 'src/app/services/account.service';
import { SocketioService } from 'src/app/services/socketio.service';

// -------------------------------------------------------------

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  private unsub = new Subject<void>();

  isMobile = true;
  isCollapsed = true;
  notifications: string[] = [];
  username = '';

  constructor(
    private observer: BreakpointObserver,
    private messageSevice: MessageService,
    private accountService: AccountService,
    private socketioService: SocketioService,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.observer.observe(['(max-width: 976px)']).subscribe((screenSize) => {
      if (screenSize.matches) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });

    this.socketioService.initSocket();

    this.accountService.currentAccount.pipe(takeUntil(this.unsub)).subscribe({
      next: (response) => {
        if (response) {
          if (!response.isVerified) {
            this.notifications.unshift(
              'Check your email to verify this account'
            );
          }
          this.username = response.username ?? '';
        }
      },
      error: () => {},
      complete: () => {},
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

  toggleMenu() {
    if (this.isMobile) {
      this.sidenav.toggle();
      this.isCollapsed = false;
    } else {
      this.sidenav.open();
      this.isCollapsed = !this.isCollapsed;
    }
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
