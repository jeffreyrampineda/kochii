import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from 'src/app/services/authentication.service';

// -------------------------------------------------------------

@Component({
  selector: 'kochii-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  opened = true;

  constructor(
    private authenticationService: AuthenticationService
  ) { }

// -------------------------------------------------------------

  ngOnInit() {
  }

  logout(): void {
    this.authenticationService.logout();

    // TODO: Change this - reason: deprecated.
    location.reload(true);
  }
}
