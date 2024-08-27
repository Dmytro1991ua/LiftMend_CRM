import * as React from 'react';
import { useMemo } from 'react';

import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import TimePickerSection from './components/TimePickerSection';
import useDatePicker from './hooks';
import { DateRangeConfigKey } from './types';
import { getDatePickerConfig, getDatePicketConfigKey } from './utils';

type DatePickerProps = {
  dateRange?: DateRange;
  className?: string;
  isDisabled?: boolean;
  onChange?: (range?: DateRange) => void;
};

const DatePicker = ({ dateRange, isDisabled, className, onChange }: DatePickerProps) => {
  const { date, onHandleSelectDates, onHandleTimeChange } = useDatePicker({ dateRange, onChange });

  const datePickerConfig = useMemo(() => getDatePickerConfig(date), [date]);
  const configKey = useMemo(() => getDatePicketConfigKey(date), [date]);

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              'min-w-[24rem] justify-start bg-white text-left font-normal border-2 border-primary/50 rounded-2xl',
              (!date || configKey === DateRangeConfigKey.WithSingleDate) && 'text-muted-foreground justify-center'
            )}
            id='date'
            variant={'outline'}
          >
            <CalendarIcon className='mr-3 h-4 w-4' />
            {datePickerConfig[configKey]}
          </Button>
        </PopoverTrigger>
        <PopoverContent align='start' className='w-auto p-0'>
          <Calendar
            initialFocus
            defaultMonth={date?.from}
            disabled={isDisabled}
            fromDate={new Date()}
            mode='range'
            numberOfMonths={2}
            selected={date}
            onSelect={onHandleSelectDates}
          />
          {date ? (
            <TimePickerSection date={date} isDisabled={isDisabled} onHandleTimeChange={onHandleTimeChange} />
          ) : null}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker;
