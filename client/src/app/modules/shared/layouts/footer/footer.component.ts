import { Component, Input } from '@angular/core';

@Component({
  selector: 'kochii-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  @Input() className = '';

}
