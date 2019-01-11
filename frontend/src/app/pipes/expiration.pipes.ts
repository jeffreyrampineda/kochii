import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'expiration' })
export class ExpirationPipe implements PipeTransform {
  transform(value: number): string {
    if (value > 0) {
      return `In ${value} days`;
    } else if (value === 0) {
      return "Today";
    }
    return `Expired ${Math.abs(value)} days ago`;
  }
}