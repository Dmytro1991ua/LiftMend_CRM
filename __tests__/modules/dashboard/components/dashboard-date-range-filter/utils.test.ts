import { startOfDay } from 'date-fns';

import { isActionButtonActive } from '@/modules/dashboard/components/dashboard-date-range-filter/utils';

describe('isActionButtonActive', () => {
  const today = new Date('2025-04-11T12:34:56.000Z');
  const sameDayMidnight = startOfDay(today);
  const yesterday = new Date('2025-04-10T08:00:00.000Z');

  it('should return true when both date ranges are the same (ignoring time)', () => {
    const stored = { from: today, to: today };
    const selected = { from: sameDayMidnight, to: sameDayMidnight };

    expect(isActionButtonActive(stored, selected)).toBe(true);
  });

  it('should return false when "from" date differs', () => {
    const stored = { from: yesterday, to: today };
    const selected = { from: today, to: today };

    expect(isActionButtonActive(stored, selected)).toBe(false);
  });

  it('should return false when "to" date differs', () => {
    const stored = { from: today, to: yesterday };
    const selected = { from: today, to: today };

    expect(isActionButtonActive(stored, selected)).toBe(false);
  });

  it('should return false if stored "from" date is missing', () => {
    const stored = { from: undefined, to: today };
    const selected = { from: today, to: today };

    expect(isActionButtonActive(stored, selected)).toBe(false);
  });

  it('should return false if stored "to" date is missing', () => {
    const stored = { from: today, to: undefined };
    const selected = { from: today, to: today };

    expect(isActionButtonActive(stored, selected)).toBe(false);
  });

  it('should return false if selected "from" date is missing', () => {
    const stored = { from: today, to: today };
    const selected = { from: undefined, to: today };

    expect(isActionButtonActive(stored, selected)).toBe(false);
  });

  it('should return false if selected "to" date is missing', () => {
    const stored = { from: today, to: today };
    const selected = { from: today, to: undefined };

    expect(isActionButtonActive(stored, selected)).toBe(false);
  });

  it('should return false if both stored "from" and "to" dates are missing', () => {
    const stored = { from: undefined, to: undefined };
    const selected = { from: today, to: today };

    expect(isActionButtonActive(stored, selected)).toBe(false);
  });

  it('should return false if both selected "from" and "to" dates are missing', () => {
    const stored = { from: today, to: today };
    const selected = { from: undefined, to: undefined };

    expect(isActionButtonActive(stored, selected)).toBe(false);
  });
});
