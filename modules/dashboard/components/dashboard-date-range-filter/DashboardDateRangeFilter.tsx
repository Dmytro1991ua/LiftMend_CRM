import { memo } from 'react';

import InfoTooltip from '@/shared/base-tooltip/info-tooltip/InfoTooltip';
import DatePicker from '@/shared/date-picker';

import CustomDateRangeActions from './custom-date-range-actions';
import { DashboardDateRangeFilterProps } from './types';

export const DEFAULT_INFO_TOOLTIP_MESSAGE =
  'The selected date range highlights repair job metrics. Elevator and Technician data remain mostly unchanged, as they are tied to repair jobs.';

const DashboardDateRangeFilter = ({
  sanitizedDateRange,
  isCalendarOpen,
  onHandleCalendarPopoverClose,
}: DashboardDateRangeFilterProps) => {
  return (
    <section className='flex items-center justify-center gap-2'>
      <InfoTooltip
        className='w-[33rem]'
        iconColor='#2563eb'
        iconSize='18'
        id={'elevatorLocation-field-id'}
        message={DEFAULT_INFO_TOOLTIP_MESSAGE}
        place='left'
      />
      <DatePicker
        key={`${sanitizedDateRange?.from?.toString()}-${sanitizedDateRange?.to?.toString()}`}
        allowPastDates={true}
        customContent={
          <CustomDateRangeActions
            sanitizedDateRange={sanitizedDateRange}
            onHandleCalendarPopoverClose={onHandleCalendarPopoverClose}
          />
        }
        dateRange={sanitizedDateRange}
        isCalendarOpen={isCalendarOpen}
        isDateRangeMode={true}
        numberOfMonths={2}
        onHandlePopoverChange={onHandleCalendarPopoverClose}
      />
    </section>
  );
};

export default memo(DashboardDateRangeFilter);
