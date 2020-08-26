import { Component, Input } from '@angular/core';

@Component({
  selector: 'kochii-presentation-container',
  templateUrl: './presentation-container.component.html',
  styleUrls: ['./presentation-container.component.css']
})
export class PresentationContainerComponent {

  @Input() title = '';
  @Input() loading = false;
  @Input() isEmpty = false;

}
