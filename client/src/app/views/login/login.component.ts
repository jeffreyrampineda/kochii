import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { Title } from '@angular/platform-browser';

// -------------------------------------------------------------

@Component({
  selector: 'kochii-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
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
    this.titleService.setTitle('Login | Kochii');
    // If currently logged in, redirect to dashboard.
    if (this.accountService.isLoggedIn) {
      this.router.navigate(['/overview']);
    }

    let accountName = '';
    let rememberMe = false;

    if (localStorage.getItem('rememberMe_accountName') !== null) {
      rememberMe = true;
      accountName = localStorage.getItem('rememberMe_accountName');
    }

    this.loginForm = this.formBuilder.group({
      accountName: [
        accountName,
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
      rememberMe: [rememberMe],
    });

    this.loginForm.get('rememberMe').valueChanges.subscribe((value) => {
      if (value == false) {
        localStorage.removeItem('rememberMe_accountName');
      }
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    if (this.loginForm.get('rememberMe').value) {
      localStorage.setItem(
        'rememberMe_accountName',
        this.loginForm.get('accountName').value
      );
    }

    this.loading = true;
    this.error_messages = [];

    const { accountName, password } = this.loginForm.value;

    this.accountService.login({ accountName, password }).subscribe({
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
