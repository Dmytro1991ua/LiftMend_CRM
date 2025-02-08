import { memo } from 'react';

import { DateRange } from 'react-day-picker';

import InfoTooltip from '@/shared/base-tooltip/info-tooltip/InfoTooltip';
import DatePicker from '@/shared/date-picker';

type DashboardDateRangeFilterProps = {
  sanitizedDateRange: DateRange;
  isCalendarOpen: boolean;
  onHandleCalendarPopoverClose: (open: boolean, range?: DateRange) => void;
};

const DEFAULT_INFO_TOOLTIP_MESSAGE =
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
        allowPastDates={true}
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
