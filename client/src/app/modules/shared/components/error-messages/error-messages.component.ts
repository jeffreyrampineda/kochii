import { Component, Input } from '@angular/core';

@Component({
  selector: 'kochii-error-messages',
  templateUrl: './error-messages.component.html',
})
export class ErrorMessagesComponent {
  @Input() loading;
  @Input() error_messages;
}
