import { DateRange } from 'react-day-picker';

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

export type CustomDateRangeAction = { label: DateRangeActionLabel; range: DateRange };

export type DashboardDateRangeFilterProps = {
  sanitizedDateRange: DateRange;
  isCalendarOpen: boolean;
  onHandleCalendarPopoverClose: (open: boolean, range?: DateRange) => void;
};
