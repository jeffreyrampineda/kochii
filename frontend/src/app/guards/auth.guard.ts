import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthenticationService } from 'src/app/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
  ) { }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean> | Promise<boolean> | boolean {

      const isLoggedIn = this.authenticationService.isLoggedIn;

      if (isLoggedIn) {
        return true;
      }

      // not logged in so redirect to login page with the return url
      this.router.navigate(['/login']);
      return false;
  }
}
