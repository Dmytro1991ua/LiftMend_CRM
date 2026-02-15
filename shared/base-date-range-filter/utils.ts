import { differenceInDays, isAfter, isEqual, isSameMonth, isValid, startOfDay } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { DATE_RANGE_VALIDATION_ALERT_CONFIG, DEFAULT_DATE_FILTER, DEFAULT_MAX_DAYS_IN_RANGE } from './constants';
import { BaseDateFilter, DateRangeErrorVariant, DateRangeValidationResult, StoredDateRange } from './types';

// Ensure `from` and `to` are valid Date objects, falling back to `DEFAULT_DATE_FILTER` if invalids
export const getSanitizeDateRange = (dateFilter?: StoredDateRange): BaseDateFilter => {
  const now = new Date();

  const fromDate = dateFilter?.from ? new Date(dateFilter.from) : null;
  const toDate = dateFilter?.to ? new Date(dateFilter.to) : null;

  const isValidDateRange = fromDate && isValid(fromDate) && toDate && isValid(toDate);

  // Checks if the stored range is an old default left over from a previous month.
  // We only treat it as "stale" if the user hasn't manually modified it.
  const isStaleSystemDefault = isValidDateRange && !dateFilter?.isCustomSelection && !isSameMonth(fromDate, now);

  // Fallback to current month if data is invalid or belongs to a past month's default.
  if (!isValidDateRange || isStaleSystemDefault) {
    return {
      from: DEFAULT_DATE_FILTER.from,
      to: DEFAULT_DATE_FILTER.to,
    };
  }

  return {
    from: fromDate,
    to: toDate,
  };
};

// Validate the date range and return the appropriate error result
export const validateDateRange = (range?: DateRange): DateRangeValidationResult | null => {
  if (!range?.from && !range?.to) {
    return DATE_RANGE_VALIDATION_ALERT_CONFIG[DateRangeErrorVariant.InvalidDateRange];
  }

  if (range?.from && !range?.to) {
    return DATE_RANGE_VALIDATION_ALERT_CONFIG[DateRangeErrorVariant.MissingEndDate];
  }

  if (isAfter(new Date(range?.from ?? ''), new Date(range?.to ?? ''))) {
    return DATE_RANGE_VALIDATION_ALERT_CONFIG[DateRangeErrorVariant.InvalidDateOrder];
  }

  // Additional validation: ensure the date range is within a reasonable span (e.g., no more than 30 days)
  if (range?.from && range?.to) {
    const daysDifference = differenceInDays(new Date(range.to), new Date(range.from));

    if (daysDifference > DEFAULT_MAX_DAYS_IN_RANGE) {
      return DATE_RANGE_VALIDATION_ALERT_CONFIG[DateRangeErrorVariant.DateRangeTooLarge];
    }
  }

  return null;
};

export const isCalendarActionButtonActive = (storedDateRange: DateRange, selectedDateRange: DateRange) => {
  if (!storedDateRange?.from || !storedDateRange?.to || !selectedDateRange?.from || !selectedDateRange?.to) {
    return false;
  }

  // Normalize the date to midnight for both "from" and "to" dates in both ranges.
  // This ensures we're comparing the actual dates, not including time differences.
  const storedFrom = startOfDay(storedDateRange.from);
  const storedTo = startOfDay(storedDateRange.to);
  const selectedFrom = startOfDay(selectedDateRange.from);
  const selectedTo = startOfDay(selectedDateRange.to);

  return isEqual(storedFrom, selectedFrom) && isEqual(storedTo, selectedTo);
};
