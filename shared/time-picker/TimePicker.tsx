import { useRef } from 'react';

import { Clock } from 'lucide-react';

import { TimePickerInput } from './components/TimePickerInput';

export interface TimePickerProps {
  date: Date | undefined;
  disabled?: boolean;
  setDate: (date: Date | undefined) => void;
}

export const TimePicker = ({ date, disabled, setDate }: TimePickerProps) => {
  const minuteRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);
  const secondRef = useRef<HTMLInputElement>(null);

  return (
    <div className='flex items-end gap-2'>
      <div className='grid gap-1 text-center'>
        <TimePickerInput
          ref={hourRef}
          date={date}
          disabled={disabled}
          picker='hours'
          setDate={setDate}
          onRightFocus={() => minuteRef.current?.focus()}
        />
      </div>
      <div className='grid gap-1 text-center'>
        <TimePickerInput
          ref={minuteRef}
          date={date}
          disabled={disabled}
          picker='minutes'
          setDate={setDate}
          onLeftFocus={() => hourRef.current?.focus()}
          onRightFocus={() => secondRef.current?.focus()}
        />
      </div>
      <div className='flex h-10 items-center'>
        <Clock className='ml-2 h-4 w-4' data-testid='clock-icon' />
      </div>
    </div>
  );
};
