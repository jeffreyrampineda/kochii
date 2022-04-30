import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { Title } from '@angular/platform-browser';

// -------------------------------------------------------------

@Component({
  selector: 'kochii-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  imgLogo = '/public/images/kochii-logo.png';
  loginForm: FormGroup;
  loading = false;
  error_messages = [];

  constructor(
    private router: Router,
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private titleService: Title,
  ) { }

  // -------------------------------------------------------------

  ngOnInit() {
    this.titleService.setTitle('Login | Kochii');

    // If currently logged in, redirect to dashboard.
    if (this.accountService.isLoggedIn) {
      this.router.navigate(['/overview']);
    }

    this.loginForm = this.formBuilder.group({
      accountName: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
        Validators.pattern('^[a-zA-Z0-9_-]*$')
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
      ]],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit(loginData) {
    if (this.loginForm.invalid || this.loading) {
      console.log('cannot submit');
      return;
    }

    console.log('submitted');
    this.loading = true;
    this.error_messages = [];

    this.accountService.login(loginData).subscribe({
      next: response => {
        if (response && response.token) {
          this.router.navigate(['/overview']);
        }
      },
      error: err => {
        this.error_messages = err.error.error_messages;
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
