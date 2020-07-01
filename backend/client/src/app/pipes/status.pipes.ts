import { Pipe, PipeTransform } from '@angular/core';

// -------------------------------------------------------------

@Pipe({ name: 'status' })
export class StatusPipe implements PipeTransform {

  transform(value: number): string {
    if (value > 10) {
        return 'good';
    } else if (value < 10 && value >= 0) {
        return 'warning';
    }
    return 'expired';
  }
}