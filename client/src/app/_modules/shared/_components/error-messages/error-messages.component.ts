import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-messages',
  templateUrl: './error-messages.component.html',
})
export class ErrorMessagesComponent {
  @Input() loading!: boolean;
  @Input() error_messages!: string[];
}
