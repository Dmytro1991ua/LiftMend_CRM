import { DateRange } from 'react-day-picker';

export enum DateRangeErrorVariant {
  InvalidDateRange = 'InvalidDateRange',
  MissingEndDate = 'MissingEndDate',
  InvalidDateOrder = 'InvalidDateOrder',
  DateRangeTooLarge = 'DateRangeTooLarge',
}

export enum DateRangeActionLabel {
  Today = 'Today',
  Yesterday = 'Yesterday',
  Tomorrow = 'Tommorow',
  ThisWeek = 'This Week',
  LastWeek = 'Last Week',
  NextWeek = 'Next Week',
  ThisMonth = 'This Month',
  LastMonth = 'Last Month',
  NextMonth = 'Next Month',
}

export type DashboardDateFilter = {
  from: Date;
  to: Date;
};

export type DateRangeValidationResult = {
  title: string;
  message: string;
};

export type CustomDateRangeAction = { label: DateRangeActionLabel; range: DateRange };

export type BaseDateRangeFilterProps = {
  sanitizedDateRange: DateRange;
  isCalendarOpen: boolean;
  tooltipMessage?: string;
  onHandleCalendarPopoverClose: (open: boolean, range?: DateRange) => void;
};
