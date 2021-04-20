import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'kochii-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  username: string;

  constructor(
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.getAccount();
  }

  getAccount(): void {
    this.accountService.currentUser.subscribe({
      next: response => {
        if (response) {
          this.username = response.username;
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
