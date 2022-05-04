import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordMatchValidator } from 'src/app/modules/shared/validators/password-match.validator';
import { AccountService } from 'src/app/services/account.service';
import { Title } from '@angular/platform-browser';

// -------------------------------------------------------------

@Component({
  selector: 'kochii-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  error_messages = [];

  constructor(
    private router: Router,
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private titleService: Title
  ) {}

  // -------------------------------------------------------------

  ngOnInit() {
    this.titleService.setTitle('Register | Kochii');
    // If currently logged in, redirect to dashboard.
    if (this.accountService.isLoggedIn) {
      this.router.navigate(['/overview']);
    }

    this.registerForm = this.formBuilder.group(
      {
        accountName: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(30),
            Validators.pattern('^[a-zA-Z0-9_-]*$'),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(30),
          ],
        ],
        passwordre: [''],
        email: ['', [Validators.required, Validators.email]],
        firstName: [
          '',
          [Validators.maxLength(30), Validators.pattern('^[a-zA-Z]*$')],
        ],
        lastName: [
          '',
          [Validators.maxLength(30), Validators.pattern('^[a-zA-Z]*$')],
        ],
      },
      { validators: PasswordMatchValidator() }
    );
  }

  /** convenience getter for easy access to form fields */
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.loading = true;
    this.error_messages = [];

    const { accountName, password, email, firstName, lastName } =
      this.registerForm.value;

    this.accountService
      .register({ accountName, password, email, firstName, lastName })
      .subscribe({
        next: (response) => {
          if (response && response.token) {
            this.router.navigate(['/overview']);
          }
        },
        error: (err) => {
          this.error_messages = err.error.error_messages;
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      });
  }
}
