import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfToday,
  startOfWeek,
  subDays,
  subMonths,
} from 'date-fns';

import { cn } from '@/lib/utils';

import { CustomDateRangeAction, DashboardDateRangeFilterProps, DateRangeActionLabel } from '../types';
import { isActionButtonActive } from '../utils';

const CustomDateRangeActions = ({
  sanitizedDateRange,
  onHandleCalendarPopoverClose,
}: Pick<DashboardDateRangeFilterProps, 'sanitizedDateRange' | 'onHandleCalendarPopoverClose'>) => {
  const CUSTOM_DATE_RANGES_ACTIONS_CONFIG: CustomDateRangeAction[] = [
    {
      label: DateRangeActionLabel.Today,
      range: { from: startOfToday(), to: startOfToday() },
    },
    {
      label: DateRangeActionLabel.Yesterday,
      range: { from: subDays(new Date(), 1), to: subDays(new Date(), 1) },
    },
    {
      label: DateRangeActionLabel.Tomorrow,
      range: { from: addDays(startOfToday(), 1), to: addDays(startOfToday(), 1) },
    },
    {
      label: DateRangeActionLabel.LastWeek,
      range: { from: startOfWeek(subDays(new Date(), 7)), to: endOfWeek(subDays(new Date(), 7)) },
    },
    {
      label: DateRangeActionLabel.NextWeek,
      range: { from: startOfWeek(addDays(new Date(), 7)), to: endOfWeek(addDays(new Date(), 7)) },
    },
    {
      label: DateRangeActionLabel.ThisWeek,
      range: { from: startOfWeek(new Date()), to: endOfWeek(new Date()) },
    },
    {
      label: DateRangeActionLabel.ThisMonth,
      range: { from: startOfMonth(new Date()), to: endOfMonth(new Date()) },
    },
    {
      label: DateRangeActionLabel.LastMonth,
      range: { from: startOfMonth(subMonths(new Date(), 1)), to: endOfMonth(subMonths(new Date(), 1)) },
    },
    {
      label: DateRangeActionLabel.NextMonth,
      range: { from: startOfMonth(addMonths(new Date(), 1)), to: endOfMonth(addMonths(new Date(), 1)) },
    },
  ];

  return (
    <section className='flex flex-col gap-2 justify-center p-4 border-r-2'>
      {CUSTOM_DATE_RANGES_ACTIONS_CONFIG.map(({ label, range }) => (
        <button
          key={label}
          className={cn(
            'px-4 py-2 text-white  rounded-lg text-sm',
            isActionButtonActive(sanitizedDateRange, range)
              ? 'bg-blue-400 hover:bg-blue-400'
              : ' bg-primary hover:bg-blue-500'
          )}
          onClick={() => onHandleCalendarPopoverClose(false, range)}
        >
          {label}
        </button>
      ))}
    </section>
  );
};

export default CustomDateRangeActions;
