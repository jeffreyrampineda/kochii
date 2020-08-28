import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'kochii-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  username: string;

  constructor(
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.getAccount();
  }

  getAccount(): void {
    this.authenticationService.currentUser.subscribe({
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
    this.authenticationService.deleteAccount().subscribe({
      next: response => {
        if (response === 1) {
          this.authenticationService.logout();
        }
      },
      error: () => {

      },
      complete: () => {

      }
    });
  }
}
