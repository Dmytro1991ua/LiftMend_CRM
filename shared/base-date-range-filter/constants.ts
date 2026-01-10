import { endOfMonth, startOfMonth } from 'date-fns';

import { DashboardDateFilter, DateRangeErrorVariant } from './types';

export const DEFAULT_DATE_FILTER: DashboardDateFilter = {
  from: startOfMonth(new Date()),
  to: endOfMonth(new Date()),
};

export const DATE_RANGE_VALIDATION_ALERT_CONFIG = {
  [DateRangeErrorVariant.InvalidDateRange]: {
    title: 'Invalid Date Range',
    message: 'Please select a valid date range, including both start and end dates.',
  },
  [DateRangeErrorVariant.MissingEndDate]: {
    title: 'Missing End Date',
    message: 'Please select an end date for the date range.',
  },
  [DateRangeErrorVariant.InvalidDateOrder]: {
    title: 'Invalid Date Order',
    message: 'Start date cannot be later than the end date.',
  },
  [DateRangeErrorVariant.DateRangeTooLarge]: {
    title: 'Date Range Too Large',
    message: 'Date range cannot exceed 30 days.',
  },
};

export const DEFAULT_MAX_DAYS_IN_RANGE = 30;
