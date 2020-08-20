import { Pipe, PipeTransform } from '@angular/core';

// -------------------------------------------------------------

@Pipe({ name: 'countdown' })
export class CountdownPipe implements PipeTransform {

  transform(value: string): number {
    const expirationDate = new Date(value);
    const today = new Date();
    const timeDiff = expirationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays;
  }
}
