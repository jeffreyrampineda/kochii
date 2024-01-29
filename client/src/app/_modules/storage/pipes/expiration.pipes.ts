import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'expiration' })
export class ExpirationPipe implements PipeTransform {
  /**
   * Transforms the value into a more readable format.
   * @param value - The number of days left before expiration.
   */
  transform(value: number): string {
    if (value > 0) {
      return `In ${value} days`;
    } else if (value === 0) {
      return 'Today';
    }
    return `${Math.abs(value)} days ago`;
  }
}
