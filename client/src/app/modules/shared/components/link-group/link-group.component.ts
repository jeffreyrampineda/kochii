import { Component, Input } from '@angular/core';

@Component({
  selector: 'kochii-link-group',
  templateUrl: './link-group.component.html',
  styleUrls: ['./link-group.component.css']
})
export class LinkGroupComponent {
  @Input() heading;

}
