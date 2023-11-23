import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-gauge-card',
  templateUrl: './gauge-card.component.html',
  styleUrls: ['./gauge-card.component.scss'],
})
export class GaugeCardComponent {
  @Input() icon = '';
  @Input() title = '';
  @Input() color = 'accent';
  @Input() value = 'N/A';
  @Input() description = '';
  @Input() change = '0';
}
