import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from 'src/app/services/authentication.service';

// -------------------------------------------------------------

@Component({
  selector: 'kochii-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
   private router: Router,
   private authenticationService: AuthenticationService,
   private formBuilder: FormBuilder
  ) { }

// -------------------------------------------------------------

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    // reset login status
    this.authenticationService.logout();
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    if (this.loginForm.invalid || this.loading) {
      console.log('cannot submit');
      return;
    }

    console.log('submitted');
    this.loading = true;
    this.error = '';

    this.authenticationService.login(this.loginForm.value).subscribe(
      response => {
        if (response && response.token) {
          this.router.navigate(['/dashboard']);
        }
      },
      err => {
        if (err.status === 401) {
          this.error = err.error;
        } else {
          this.error = 'Unknown error';
          console.log('unknown error from login');
        }
        this.loading = false;
      }
    );
  }
}
