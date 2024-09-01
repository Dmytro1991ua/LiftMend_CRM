import { TimePickerConfig, TimePickerType } from '../types';

const commonSubLabel = '(hours/minutes)';

export const TIME_PICKER_CONFIG: Record<TimePickerType, TimePickerConfig> = {
  [TimePickerType.START]: {
    label: 'Start Date Time',
    subLabel: commonSubLabel,
  },
  [TimePickerType.END]: {
    label: 'End Date Time',
    subLabel: commonSubLabel,
  },
  [TimePickerType.SINGLE]: {
    label: 'Date Time',
    subLabel: commonSubLabel,
  },
};
