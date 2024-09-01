import { useMemo } from 'react';

import { DateRange } from 'react-day-picker';

import { TimePickerType } from '../types';

import { TIME_PICKER_CONFIG } from './config';
import TimePickerField from './TimePickerField';

type TimePickerFieldProps = {
  dateRange?: DateRange;
  singleDate?: Date;
  isDisabled?: boolean;
  isDateRangeMode?: boolean;
  onHandleTimeChange: (updatedDate?: Date, isStart?: boolean) => void;
};

const TimePickerSection = ({ dateRange, singleDate, isDisabled, onHandleTimeChange }: TimePickerFieldProps) => {
  const renderTimePickerForDateRange = useMemo(
    () => (
      <>
        {dateRange?.from && (
          <TimePickerField
            date={dateRange.from}
            isDisabled={isDisabled}
            isStartPosition={true}
            label={TIME_PICKER_CONFIG[TimePickerType.START].label}
            subLabel={TIME_PICKER_CONFIG[TimePickerType.START].subLabel}
            onHandleTimeChange={(date) => onHandleTimeChange(date, true)}
          />
        )}
        {dateRange?.to && (
          <TimePickerField
            date={dateRange.to}
            isDisabled={isDisabled}
            isStartPosition={false}
            label={TIME_PICKER_CONFIG[TimePickerType.END].label}
            subLabel={TIME_PICKER_CONFIG[TimePickerType.END].subLabel}
            onHandleTimeChange={(date) => onHandleTimeChange(date, false)}
          />
        )}
      </>
    ),
    [dateRange, isDisabled, onHandleTimeChange]
  );

  const renderTimePickerForSingleDate = useMemo(
    () => (
      <TimePickerField
        date={singleDate}
        isDisabled={isDisabled}
        isStartPosition={true}
        label={TIME_PICKER_CONFIG[TimePickerType.SINGLE].label}
        subLabel={TIME_PICKER_CONFIG[TimePickerType.SINGLE].subLabel}
        onHandleTimeChange={(date) => onHandleTimeChange(date)}
      />
    ),
    [singleDate, isDisabled, onHandleTimeChange]
  );

  return (
    <div className='flex justify-between py-2 px-4 border-t-2'>
      {dateRange ? renderTimePickerForDateRange : singleDate ? renderTimePickerForSingleDate : null}
    </div>
  );
};

export default TimePickerSection;
