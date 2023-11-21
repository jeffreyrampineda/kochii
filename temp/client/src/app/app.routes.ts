import { Routes } from '@angular/router';

// Views
import { LoginComponent } from './_views/login/login.component';

// -------------------------------------------------------------

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'login' },
];
