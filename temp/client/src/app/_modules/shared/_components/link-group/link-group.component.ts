import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-link-group',
  templateUrl: './link-group.component.html',
  styleUrls: ['./link-group.component.css'],
})
export class LinkGroupComponent {
  @Input() heading!: string;
}
