import { Component, Input } from '@angular/core';

@Component({
  selector: 'kochii-gauge-card',
  templateUrl: './gauge-card.component.html',
  styleUrls: ['./gauge-card.component.css']
})
export class GaugeCardComponent {

  @Input() icon = '';
  @Input() title = '';
  @Input() color = 'accent';
  @Input() value = 'N/A';
  @Input() description = '';

}
