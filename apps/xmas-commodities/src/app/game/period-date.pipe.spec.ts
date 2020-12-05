import { PeriodDatePipe } from './period-date.pipe';

describe('PeriodDatePipe', () => {
  it('should cater for the initial value', () => {
    expect(runPipeTransform(0)).toEqual(new Date(2020, 11, 1, 8));
  });

  it('should increment the time by 15 minutes', () => {
    expect(runPipeTransform(1)).toEqual(new Date(2020, 11, 1, 8, 15));
    expect(runPipeTransform(2)).toEqual(new Date(2020, 11, 1, 8, 30));
    expect(runPipeTransform(3)).toEqual(new Date(2020, 11, 1, 8, 45));
  });

  it('should increment the hour when required', () => {
    expect(runPipeTransform(4)).toEqual(new Date(2020, 11, 1, 9, 0));
  });

  it('should increment until the market close', () => {
    expect(runPipeTransform(4 * 8 - 1)).toEqual(new Date(2020, 11, 1, 15, 45));
  });

  it('should display the market close', () => {
    expect(runPipeTransform(4 * 8)).toEqual(new Date(2020, 11, 1, 16, 0));
  });

  it('should support the next market open', () => {
    expect(runPipeTransform(4 * 8 + 1)).toEqual(new Date(2020, 11, 2, 8, 0));
  });

  function runPipeTransform(value: number): Date {
    return new PeriodDatePipe().transform(value);
  }
});
