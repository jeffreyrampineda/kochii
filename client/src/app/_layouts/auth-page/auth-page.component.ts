import { environment } from '../../../environments/environment';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
})
export class AuthPageComponent {
  @Input() title!: string;

  domainUrl = environment.domain;
}
