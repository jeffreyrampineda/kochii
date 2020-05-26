import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from 'src/app/services/authentication.service';

// -------------------------------------------------------------

@Component({
  selector: 'kochii-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  error = '';

  constructor(
   private router: Router,
   private authenticationService: AuthenticationService,
   private formBuilder: FormBuilder
  ) { }

// -------------------------------------------------------------

  /** Validator for comparing password and passwordre */
  checkPasswords(group: FormGroup) {
    const password = group.controls.password.value;
    const passwordre = group.controls.passwordre.value;

    return password === passwordre ? null : { notSame: true };
  }

  ngOnInit() {
    // If currently logged in, redirect to dashboard.
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/dashboard']);
    }

    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      passwordre: [''],
      email: ['', [
        Validators.required, 
        Validators.email
      ]]
    }, { validator: this.checkPasswords });
  }

  /** convenience getter for easy access to form fields */
  get f() { return this.registerForm.controls; }

  onSubmit() {
    if (this.registerForm.invalid || this.loading) {
      console.log('cannot submit');
      return;
    }

    console.log('submitted');
    this.loading = true;
    this.error = '';

    const { username, password, email } = this.registerForm.value;

    this.authenticationService.register({ username, password, email }).subscribe({
      next: response => {
        if (response && response.token) {
          this.router.navigate(['/dashboard']);
        }
      }, 
      error: err => {
        this.error = err.error;
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
