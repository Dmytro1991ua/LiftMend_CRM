import * as React from 'react';
import { useMemo, useState } from 'react';

import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { DateRangeConfigKey } from './types';
import { getDatePickerConfig, getDatePicketConfigKey } from './utils';

type DatePickerProps = {
  dateRange?: DateRange;
  className?: string;
  isDisabled?: boolean;
};

const DatePicker = ({ dateRange, isDisabled, className }: DatePickerProps) => {
  const [date, setDate] = useState<DateRange | undefined>(dateRange);

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
            onSelect={setDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker;
