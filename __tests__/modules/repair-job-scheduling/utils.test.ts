import { endOfDay, startOfDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

import { adjustDateForAllDayEvent } from '@/modules/repair-job-scheduling/utils';

jest.mock('date-fns-tz', () => {
  const original = jest.requireActual('date-fns-tz');
  return {
    ...original,
    toZonedTime: jest.fn((date: Date) => new Date(date)),
  };
});

describe('adjustDateForAllDayEvent', () => {
  const baseDate = new Date('2025-05-11T12:00:00Z');

  it('should return undefined for invalid date', () => {
    expect(adjustDateForAllDayEvent(undefined, true, 'start')).toBeUndefined();
  });

  it('should return startOfDay when allDay is true and position is start', () => {
    const result = adjustDateForAllDayEvent(baseDate, true, 'start');

    const expected = startOfDay(baseDate);

    expect(result?.toISOString()).toBe(expected.toISOString());
  });

  it('should return endOfDay when allDay is true and position is end', () => {
    const result = adjustDateForAllDayEvent(baseDate, true, 'end');

    const expected = endOfDay(baseDate);

    expect(result?.toISOString()).toBe(expected.toISOString());
  });

  it('should return the original date (converted to zoned) when allDay is false', () => {
    const result = adjustDateForAllDayEvent(baseDate, false, 'start');

    expect(result?.toISOString()).toBe(baseDate.toISOString());
  });

  it('should return undefined for invalid adjusted date', () => {
    (toZonedTime as jest.Mock).mockReturnValueOnce(new Date('Invalid Date'));

    const result = adjustDateForAllDayEvent(baseDate, true, 'start');

    expect(result).toBeUndefined();
  });
});
