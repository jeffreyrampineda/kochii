import { Component, Input } from '@angular/core';

@Component({
  selector: 'kochii-auth-page',
  templateUrl: './auth-page.component.html',
})
export class AuthPageComponent {
  @Input() title;
}
