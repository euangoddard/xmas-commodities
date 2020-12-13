import { Pipe, PipeTransform } from '@angular/core';
import { addMinutes } from 'date-fns';
import {
  INTERVAL_MINS,
  INTERVALS_PER_DAY,
  MARKET_OPEN,
} from './game.constants';

@Pipe({
  name: 'periodDate',
})
export class PeriodDatePipe implements PipeTransform {
  transform(value: number): Date {
    const elapsedDays = Math.floor(value / INTERVALS_PER_DAY);
    const intervalInDay = value % INTERVALS_PER_DAY;

    const dayStart = new Date(2020, 11, 1 + elapsedDays, MARKET_OPEN);
    return addMinutes(dayStart, intervalInDay * INTERVAL_MINS);
  }
}
