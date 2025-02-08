import { differenceInDays, isAfter, isValid } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { DATE_RANGE_VALIDATION_ALERT_CONFIG, DEFAULT_DATE_FILTER, DEFAULT_MAX_DAYS_IN_RANGE } from './constants';
import { DashboardDateFilter, DateRangeErrorVariant, DateRangeValidationResult } from './types';

// Ensure `from` and `to` are valid Date objects, falling back to `DEFAULT_DATE_FILTER` if invalids
export const getSanitizeDateRange = (dateFilter?: DateRange): DashboardDateFilter => {
  const fromDate = dateFilter?.from ? new Date(dateFilter.from) : null;
  const toDate = dateFilter?.to ? new Date(dateFilter.to) : null;

  const isValidFromDate = fromDate && isValid(fromDate);
  const isValidToDate = toDate && isValid(toDate);

  return {
    from: isValidFromDate ? fromDate : new Date(DEFAULT_DATE_FILTER.from),
    to: isValidToDate ? toDate : new Date(DEFAULT_DATE_FILTER.to),
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
