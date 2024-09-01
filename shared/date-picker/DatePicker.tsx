import * as React from 'react';
import { useCallback, useMemo } from 'react';

import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar, CalendarProps } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import TimePickerSection from './components/TimePickerSection';
import useDatePicker from './hooks';
import { DateRangeConfigKey } from './types';
import { getDatePickerConfig, getDatePicketConfigKey } from './utils';

type DatePickerProps = {
  dateRange?: DateRange;
  singleDate?: Date;
  className?: string;
  isDisabled?: boolean;
  onChange?: (range?: DateRange) => void;
  onSingleDateChange?: (singleDate?: Date) => void;
};

const DatePicker = ({
  dateRange,
  singleDate,
  isDisabled,
  className,
  onChange,
  onSingleDateChange,
}: DatePickerProps) => {
  const { dateRangeState, singleDateState, onHandleSelectSingleDate, onHandleSelectDates, onHandleTimeChange } =
    useDatePicker({ dateRange, singleDate, onChange, onSingleDateChange });

  const datePickerConfig = useMemo(() => getDatePickerConfig(dateRangeState, singleDate), [dateRangeState, singleDate]);
  const configKey = useMemo(() => getDatePicketConfigKey(dateRangeState, singleDate), [dateRangeState, singleDate]);

  const isDateRangeMode = Boolean(dateRangeState?.from && dateRangeState?.to);

  const getDateRangeModeProps = useCallback(
    (): CalendarProps => ({
      defaultMonth: dateRangeState?.from,
      mode: 'range' as const,
      selected: dateRangeState,
      numberOfMonths: 2,
      onSelect: (range: DateRange | undefined) => onHandleSelectDates(range),
    }),
    [dateRangeState, onHandleSelectDates]
  );

  const getSingleDateModeProps = useCallback(
    (): CalendarProps => ({
      defaultMonth: singleDateState ? new Date(singleDateState) : undefined,
      mode: 'single' as const,
      numberOfMonths: 1,
      selected: singleDateState ? new Date(singleDateState) : undefined,
      onSelect: (date: Date | undefined) => onHandleSelectSingleDate(date),
    }),
    [singleDateState, onHandleSelectSingleDate]
  );

  const calendarProps = useMemo(
    () => (isDateRangeMode ? getDateRangeModeProps() : getSingleDateModeProps()),
    [getDateRangeModeProps, getSingleDateModeProps, isDateRangeMode]
  );

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              'min-w-[24rem] justify-start bg-white text-left font-normal border-2 border-primary/50 rounded-2xl',
              (!dateRangeState ||
                !singleDate ||
                configKey === DateRangeConfigKey.WithDateRangeSingleDate ||
                configKey === DateRangeConfigKey.WithSingleDate) &&
                'text-muted-foreground justify-center'
            )}
            id='date'
            variant={'outline'}
          >
            <CalendarIcon className='mr-3 h-4 w-4' />
            {datePickerConfig[configKey]}
          </Button>
        </PopoverTrigger>
        <PopoverContent align='start' className='w-auto p-0'>
          <Calendar initialFocus disabled={isDisabled} fromDate={new Date()} {...calendarProps} />
          {dateRangeState || singleDateState ? (
            <TimePickerSection
              dateRange={dateRangeState}
              isDisabled={isDisabled}
              singleDate={singleDateState}
              onHandleTimeChange={onHandleTimeChange}
            />
          ) : null}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker;
