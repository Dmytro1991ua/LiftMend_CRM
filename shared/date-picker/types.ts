export enum DateRangeConfigKey {
  NoDate = 'noDate',
  WithDateRange = ' withDateRange',
  WithSingleDate = 'withSingleDate',
}

export type DatePickerConfigValue = React.JSX.Element | string | undefined;

export const DEFAULT_DATE_PICKER_PLACEHOLDER = 'Pick a date';

export enum TimePickerType {
  START = 'start',
  END = 'end',
}

export type TimePickerConfig = {
  label: string;
  subLabel: string;
};
