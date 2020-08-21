import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Title } from '@angular/platform-browser';

// -------------------------------------------------------------

@Component({
  selector: 'kochii-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  imgLogo = '//www.kochii.app/kochii-logo.png';
  registerForm: FormGroup;
  loading = false;
  error = {
    username: undefined,
    password: undefined,
    email: undefined
  };

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private titleService: Title,
  ) { }

  // -------------------------------------------------------------

  /** Validator for comparing password and passwordre */
  checkPasswords(group: FormGroup) {
    const password = group.controls.password.value;
    const passwordre = group.controls.passwordre.value;

    return password === passwordre ? null : { notSame: true };
  }

  ngOnInit() {
    this.titleService.setTitle('Register | Kochii');

    // If currently logged in, redirect to dashboard.
    if (this.authenticationService.isLoggedIn) {
      this.router.navigate(['/app']);
    }

    this.registerForm = this.formBuilder.group({
      username: ['', [
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
      passwordre: [''],
      email: ['', [
        Validators.required,
        Validators.email
      ]]
    }, { validator: this.checkPasswords });
  }

  /** convenience getter for easy access to form fields */
  get f() { return this.registerForm.controls; }

  onSubmit(registerData) {
    if (this.registerForm.invalid || this.loading) {
      console.log('cannot submit');
      return;
    }

    console.log('submitted');
    this.loading = true;
    this.error = {
      username: undefined,
      password: undefined,
      email: undefined
    };

    const { username, password, email } = registerData;

    this.authenticationService.register({ username, password, email }).subscribe({
      next: response => {
        if (response && response.token) {
          this.router.navigate(['/app']);
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
