import * as React from 'react';
import { useMemo, useState } from 'react';

import { addMonths } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { getDatePickerConfig, getDatePicketConfigKey } from './utils';

const DatePicker = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const today = new Date();
  const nextMonth = addMonths(today, 1);

  const [date, setDate] = useState<DateRange | undefined>({
    from: today,
    to: nextMonth,
  });

  const datePickerConfig = useMemo(() => getDatePickerConfig(date), [date]);
  const configKey = useMemo(() => getDatePicketConfigKey(date), [date]);

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              'min-w-[24rem] justify-start bg-white text-left font-normal border-2 border-primary/50 rounded-2xl',
              !date && 'text-muted-foreground justify-center'
            )}
            id='date'
            variant={'outline'}>
            <CalendarIcon className='mr-3 h-4 w-4' />
            {datePickerConfig[configKey]}
          </Button>
        </PopoverTrigger>
        <PopoverContent align='start' className='w-auto p-0'>
          <Calendar
            initialFocus
            defaultMonth={date?.from}
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
