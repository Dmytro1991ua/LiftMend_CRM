export enum DateRangeConfigKey {
  NoDate = 'noDate',
  WithDateRange = ' withDateRange',
  WithSingleDate = 'withSingleDate',
}

export type DatePickerConfigValue = React.JSX.Element | string | undefined;

export const DEFAULT_DATE_PICKER_PLACEHOLDER = 'Pick a date';
