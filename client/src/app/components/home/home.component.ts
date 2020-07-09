import { Component, OnInit, HostListener } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { Validators, FormGroup, FormControl } from '@angular/forms';

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
      state('hide', style({
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
  feedbackForm;

  constructor(
    private authenticationService: AuthenticationService,
  ) {
    this.feedbackForm = new FormGroup({
      'name': new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
      'email': new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      'message': new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(700)
      ])
    });
  }

  // -------------------------------------------------------------

  ngOnInit() {
    this.isLoggedIn = this.authenticationService.isLoggedIn;
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

  isMessageInvalid(): boolean {
    return this.feedbackForm.invalid;
  }

  /**
   * Logs out the current user.
   */
  logout(): void {
    this.authenticationService.logout();
    this.isLoggedIn = this.authenticationService.isLoggedIn;
  }

  get f() { return this.feedbackForm.controls; }

  get getMessage() { return this.f.message.value; }

  get getSubject() {
    return `Contact/Feedback from ${this.f.name.value} (${this.f.email.value})`;
  }
}
