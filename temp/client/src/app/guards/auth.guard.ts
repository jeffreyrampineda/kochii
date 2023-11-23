import { Router, CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';

import { AccountService } from '../services/account.service';

export const AuthGuard: CanActivateFn = () => {
  const router: Router = inject(Router);
  const accountService: AccountService = inject(AccountService);
  if (accountService.isLoggedIn) {
    return true;
  }

  // not logged in so redirect to login page with the return url
  router.navigate(['/login']);
  return false;
};
