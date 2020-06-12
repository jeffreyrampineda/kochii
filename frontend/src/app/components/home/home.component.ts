import { Component, OnInit, HostListener } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

// -------------------------------------------------------------

@Component({
  selector: 'kochii-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('scrollAnimation', [
      state('show', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      state('hide',   style({
        opacity: 0,
        transform: 'translateY(-100%)'
      })),
      transition('show => hide', animate('300ms ease-out')),
      transition('hide => show', animate('300ms ease-in'))
    ])
  ],
})
export class HomeComponent implements OnInit {

  isLoggedIn = false;
  state = 'hide';

  constructor(
    private authenticationService: AuthenticationService,
  ) { }

// -------------------------------------------------------------

  ngOnInit() {
    this.isLoggedIn = this.authenticationService.currentUserValue ? true : false;
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    const topSection = window.innerHeight;
    const scrollPosition = window.pageYOffset;

    if (scrollPosition >= topSection) {
      this.state = 'show';
    } else {
      this.state = 'hide';
    }
  }

  /**
   * Logs out the current user.
   */
  logout(): void {
    this.authenticationService.logout();
  }
}
