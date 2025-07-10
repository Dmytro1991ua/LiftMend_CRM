import { TimePicker } from '@/shared/time-picker/TimePicker';

export type TimePickerFieldProps = {
  label: string;
  subLabel: string;
  date?: Date;
  isDisabled?: boolean;
  onHandleTimeChange: (updatedDate?: Date, isStart?: boolean) => void;
  isStartPosition: boolean;
  dataTestId?: string;
};

const TimePickerField = ({
  label,
  subLabel,
  date,
  isDisabled,
  onHandleTimeChange,
  isStartPosition,
  dataTestId,
}: TimePickerFieldProps) => {
  return (
    <div data-testid={dataTestId}>
      <div className='flex flex-col mb-2'>
        <span className='text-xs font-bold'>{label}</span>
        <span className='text-xs text-gray-500'>{subLabel}</span>
      </div>
      <TimePicker
        date={date}
        disabled={isDisabled}
        setDate={(newDate) => onHandleTimeChange(newDate, isStartPosition)}
      />
    </div>
  );
};

export default TimePickerField;
