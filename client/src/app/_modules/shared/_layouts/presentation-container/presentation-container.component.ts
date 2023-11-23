import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-presentation-container',
  templateUrl: './presentation-container.component.html',
})
export class PresentationContainerComponent {

  @Input() title = '';
  @Input() loading = false;
  @Input() isEmpty = false;

}
