import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';

import { Account } from '../../../interfaces/account';

@Component({
  selector: 'kochii-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  account: Account;

  constructor(
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.getAccount();
  }

  getAccount(): void {
    this.accountService.currentAccount.subscribe({
      next: response => {
        if (response) {
          this.account = response;
        }
      },
      error: () => {

      },
      complete: () => {

      }
    });
  }

  deleteAccount(): void {
    this.accountService.deleteAccount().subscribe({
      next: response => {
        if (response === 1) {
          this.accountService.logout();
        }
      },
      error: () => {

      },
      complete: () => {

      }
    });
  }
}
