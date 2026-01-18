import { memo } from 'react';

import InfoTooltip from '../base-tooltip/info-tooltip/InfoTooltip';
import DatePicker from '../date-picker';

import CustomDateRangeActions from './custom-date-range-actions';
import { BaseDateRangeFilterProps } from './types';

const BaseDateRangeFilter = ({
  sanitizedDateRange,
  isCalendarOpen,
  tooltipMessage,
  isDisabled,
  onHandleCalendarPopoverClose,
}: BaseDateRangeFilterProps) => {
  return (
    <section className='flex items-center justify-center gap-2'>
      {tooltipMessage && (
        <InfoTooltip
          className='w-[33rem] !shadow-none'
          iconColor='#2563eb'
          iconSize='18'
          id='date-range-tooltip'
          message={tooltipMessage}
          place='left'
        />
      )}
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
        isDisabled={isDisabled}
        numberOfMonths={2}
        onHandlePopoverChange={onHandleCalendarPopoverClose}
      />
    </section>
  );
};

export default memo(BaseDateRangeFilter);
