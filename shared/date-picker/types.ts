export enum DateRangeConfigKey {
  NoDate = 'noDate',
  WithDateRange = ' withDateRange',
  WithDateRangeSingleDate = 'withDateRangeSingleDate',
  WithSingleDate = 'withSingleDate',
}

export type DatePickerConfigValue = React.JSX.Element | string | undefined;

export const DEFAULT_DATE_PICKER_PLACEHOLDER = 'Pick a date';

export enum TimePickerType {
  START = 'start',
  END = 'end',
  SINGLE = 'single',
}

export type TimePickerConfig = {
  label: string;
  subLabel: string;
};
