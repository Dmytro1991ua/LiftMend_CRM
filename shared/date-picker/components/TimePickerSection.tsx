import { DateRange } from 'react-day-picker';

import { TimePickerType } from '../types';

import { TIME_PICKER_CONFIG } from './config';
import TimePickerField from './TimePickerField';

type TimePickerFieldProps = {
  date?: DateRange;
  isDisabled?: boolean;
  onHandleTimeChange: (updatedDate?: Date, isStart?: boolean) => void;
};

const TimePickerSection = ({ date, isDisabled, onHandleTimeChange }: TimePickerFieldProps) => {
  return (
    <div className='flex justify-between py-2 px-4 border-t-2'>
      {date?.from && (
        <TimePickerField
          date={date.from}
          isDisabled={isDisabled}
          isStartPosition={true}
          label={TIME_PICKER_CONFIG[TimePickerType.START].label}
          subLabel={TIME_PICKER_CONFIG[TimePickerType.START].subLabel}
          onHandleTimeChange={onHandleTimeChange}
        />
      )}
      {date?.to && (
        <TimePickerField
          date={date.to}
          isDisabled={isDisabled}
          isStartPosition={false}
          label={TIME_PICKER_CONFIG[TimePickerType.END].label}
          subLabel={TIME_PICKER_CONFIG[TimePickerType.END].subLabel}
          onHandleTimeChange={onHandleTimeChange}
        />
      )}
    </div>
  );
};

export default TimePickerSection;
