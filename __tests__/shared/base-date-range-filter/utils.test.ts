import { addDays, startOfDay } from 'date-fns';

import {
  DATE_RANGE_VALIDATION_ALERT_CONFIG,
  DEFAULT_DATE_FILTER,
  DEFAULT_MAX_DAYS_IN_RANGE,
} from '@/shared/base-date-range-filter/constants';
import { DateRangeErrorVariant } from '@/shared/base-date-range-filter/types';
import {
  getSanitizeDateRange,
  isCalendarActionButtonActive,
  validateDateRange,
} from '@/shared/base-date-range-filter/utils';

describe('getSanitizeDateRange', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return provided valid dates', () => {
    const mockFromDate = new Date('2025-01-01');
    const mockToDate = new Date('2025-01-10');

    const result = getSanitizeDateRange({ from: mockFromDate, to: mockToDate });

    expect(result).toEqual({ from: mockFromDate, to: mockToDate });
  });

  it('should fall back to default dates when input is undefined', () => {
    const result = getSanitizeDateRange();

    expect(result.from).toEqual(DEFAULT_DATE_FILTER.from);
    expect(result.to).toEqual(DEFAULT_DATE_FILTER.to);
  });

  it('should fall back to default "from" when from date is invalid', () => {
    const result = getSanitizeDateRange({
      from: new Date('invalid'),
      to: new Date('2025-01-10'),
    });

    expect(result.from).toEqual(DEFAULT_DATE_FILTER.from);
    expect(result.to).toEqual(new Date('2025-01-10'));
  });

  it('should fall back to default "to" when to date is invalid', () => {
    const result = getSanitizeDateRange({
      from: new Date('2025-01-01'),
      to: new Date('invalid'),
    });

    expect(result.from).toEqual(new Date('2025-01-01'));
    expect(result.to).toEqual(DEFAULT_DATE_FILTER.to);
  });

  it('should fall back to defaults when both dates are invalid', () => {
    const result = getSanitizeDateRange({
      from: new Date('invalid'),
      to: new Date('invalid'),
    });

    expect(result).toEqual(DEFAULT_DATE_FILTER);
  });
});

describe('validateDateRange', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should require both start and end dates to be selected', () => {
    const result = validateDateRange({ from: undefined, to: undefined });

    expect(result).toEqual(DATE_RANGE_VALIDATION_ALERT_CONFIG[DateRangeErrorVariant.InvalidDateRange]);
  });

  it('should do not allow selecting a start date without an end date', () => {
    const result = validateDateRange({
      from: new Date('2025-02-03'),
    });

    expect(result).toEqual(DATE_RANGE_VALIDATION_ALERT_CONFIG[DateRangeErrorVariant.MissingEndDate]);
  });

  it('should not allow start date to be after end date', () => {
    const result = validateDateRange({
      from: new Date('2025-01-10'),
      to: new Date('2025-01-01'),
    });

    expect(result).toEqual(DATE_RANGE_VALIDATION_ALERT_CONFIG[DateRangeErrorVariant.InvalidDateOrder]);
  });

  it('should not allow date range longer than the maximum allowed', () => {
    const mockFromDate = new Date('2025-01-01');
    const mockToDate = addDays(mockFromDate, DEFAULT_MAX_DAYS_IN_RANGE + 1);

    const result = validateDateRange({ from: mockFromDate, to: mockToDate });

    expect(result).toEqual(DATE_RANGE_VALIDATION_ALERT_CONFIG[DateRangeErrorVariant.DateRangeTooLarge]);
  });

  it('should accept a valid date range within the allowed limit', () => {
    const mockFromDate = new Date('2025-02-11');
    const mockToDate = addDays(mockFromDate, DEFAULT_MAX_DAYS_IN_RANGE);

    const result = validateDateRange({ from: mockFromDate, to: mockToDate });

    expect(result).toBeNull();
  });

  it('should accept a single-day date range', () => {
    const mockDate = new Date('2025-01-01');

    const result = validateDateRange({ from: mockDate, to: mockDate });

    expect(result).toBeNull();
  });
});

describe('isActionButtonActive', () => {
  const today = new Date('2025-04-11T12:34:56.000Z');
  const sameDayMidnight = startOfDay(today);
  const yesterday = new Date('2025-04-10T08:00:00.000Z');

  it('should return true when both date ranges are the same (ignoring time)', () => {
    const stored = { from: today, to: today };
    const selected = { from: sameDayMidnight, to: sameDayMidnight };

    expect(isCalendarActionButtonActive(stored, selected)).toBe(true);
  });

  it('should return false when "from" date differs', () => {
    const stored = { from: yesterday, to: today };
    const selected = { from: today, to: today };

    expect(isCalendarActionButtonActive(stored, selected)).toBe(false);
  });

  it('should return false when "to" date differs', () => {
    const stored = { from: today, to: yesterday };
    const selected = { from: today, to: today };

    expect(isCalendarActionButtonActive(stored, selected)).toBe(false);
  });

  it('should return false if stored "from" date is missing', () => {
    const stored = { from: undefined, to: today };
    const selected = { from: today, to: today };

    expect(isCalendarActionButtonActive(stored, selected)).toBe(false);
  });

  it('should return false if stored "to" date is missing', () => {
    const stored = { from: today, to: undefined };
    const selected = { from: today, to: today };

    expect(isCalendarActionButtonActive(stored, selected)).toBe(false);
  });

  it('should return false if selected "from" date is missing', () => {
    const stored = { from: today, to: today };
    const selected = { from: undefined, to: today };

    expect(isCalendarActionButtonActive(stored, selected)).toBe(false);
  });

  it('should return false if selected "to" date is missing', () => {
    const stored = { from: today, to: today };
    const selected = { from: today, to: undefined };

    expect(isCalendarActionButtonActive(stored, selected)).toBe(false);
  });

  it('should return false if both stored "from" and "to" dates are missing', () => {
    const stored = { from: undefined, to: undefined };
    const selected = { from: today, to: today };

    expect(isCalendarActionButtonActive(stored, selected)).toBe(false);
  });

  it('should return false if both selected "from" and "to" dates are missing', () => {
    const stored = { from: today, to: today };
    const selected = { from: undefined, to: undefined };

    expect(isCalendarActionButtonActive(stored, selected)).toBe(false);
  });
});
