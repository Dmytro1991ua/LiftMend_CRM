import { differenceInDays, isAfter, isValid } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { FaCogs, FaTools, FaUserCog } from 'react-icons/fa';
import { FaElevator, FaUsers } from 'react-icons/fa6';
import { MdOutlineWarningAmber } from 'react-icons/md';

import { DashboardMetrics } from '@/graphql/types/client/generated_types';
import {
  COMMON_METRIC_CARD_ICON_STYLES,
  COMMON_METRIC_CARD_STYLES,
  DEFAULT_CARD_METRIC_TEXT,
} from '@/shared/base-app-metrics/constants';
import { BaseMetricsConfig } from '@/shared/base-app-metrics/types';

import { DATE_RANGE_VALIDATION_ALERT_CONFIG, DEFAULT_DATE_FILTER, DEFAULT_MAX_DAYS_IN_RANGE } from './constants';
import { DashboardDateFilter, DateRangeErrorVariant, DateRangeValidationResult, KeyMetricCardTitle } from './types';

// Ensure `from` and `to` are valid Date objects, falling back to `DEFAULT_DATE_FILTER` if invalids
export const getSanitizeDateRange = (dateFilter?: DateRange): DashboardDateFilter => {
  const fromDate = dateFilter?.from ? new Date(dateFilter.from) : null;
  const toDate = dateFilter?.to ? new Date(dateFilter.to) : null;

  const isValidFromDate = fromDate && isValid(fromDate);
  const isValidToDate = toDate && isValid(toDate);

  return {
    from: isValidFromDate ? fromDate : new Date(DEFAULT_DATE_FILTER.from),
    to: isValidToDate ? toDate : new Date(DEFAULT_DATE_FILTER.to),
  };
};

// Validate the date range and return the appropriate error result
export const validateDateRange = (range?: DateRange): DateRangeValidationResult | null => {
  if (!range?.from && !range?.to) {
    return DATE_RANGE_VALIDATION_ALERT_CONFIG[DateRangeErrorVariant.InvalidDateRange];
  }

  if (range?.from && !range?.to) {
    return DATE_RANGE_VALIDATION_ALERT_CONFIG[DateRangeErrorVariant.MissingEndDate];
  }

  if (isAfter(new Date(range?.from ?? ''), new Date(range?.to ?? ''))) {
    return DATE_RANGE_VALIDATION_ALERT_CONFIG[DateRangeErrorVariant.InvalidDateOrder];
  }

  // Additional validation: ensure the date range is within a reasonable span (e.g., no more than 30 days)
  if (range?.from && range?.to) {
    const daysDifference = differenceInDays(new Date(range.to), new Date(range.from));

    if (daysDifference > DEFAULT_MAX_DAYS_IN_RANGE) {
      return DATE_RANGE_VALIDATION_ALERT_CONFIG[DateRangeErrorVariant.DateRangeTooLarge];
    }
  }

  return null;
};

export const getKeyMetricsConfig = (metrics: DashboardMetrics): BaseMetricsConfig<KeyMetricCardTitle>[] => {
  return [
    {
      id: 1,
      ...COMMON_METRIC_CARD_STYLES,
      icon: <FaTools className={COMMON_METRIC_CARD_ICON_STYLES} />,
      title: KeyMetricCardTitle.TotalRepairJobs,
      metric: metrics.repairJobsMetrics?.totalRepairJobs ?? DEFAULT_CARD_METRIC_TEXT,
    },
    {
      id: 2,
      ...COMMON_METRIC_CARD_STYLES,
      icon: <FaElevator className={COMMON_METRIC_CARD_ICON_STYLES} />,
      title: KeyMetricCardTitle.TotalElevators,
      metric: metrics.elevatorRecordsMetrics?.totalElevatorRecords ?? DEFAULT_CARD_METRIC_TEXT,
    },
    {
      id: 3,
      ...COMMON_METRIC_CARD_STYLES,
      icon: <FaUserCog className={COMMON_METRIC_CARD_ICON_STYLES} />,
      title: KeyMetricCardTitle.TotalTechnicians,
      metric: metrics.technicianRecordsMetrics?.totalTechnicianRecords ?? DEFAULT_CARD_METRIC_TEXT,
    },
    {
      id: 4,
      ...COMMON_METRIC_CARD_STYLES,
      icon: <FaCogs className={COMMON_METRIC_CARD_ICON_STYLES} />,
      title: KeyMetricCardTitle.OngoingRepairJobs,
      metric: metrics.repairJobsMetrics?.ongoingRepairJobs ?? DEFAULT_CARD_METRIC_TEXT,
    },
    {
      id: 5,
      ...COMMON_METRIC_CARD_STYLES,
      icon: <AiOutlineCheckCircle className={COMMON_METRIC_CARD_ICON_STYLES} />,
      title: KeyMetricCardTitle.CompletedTodayJobs,
      metric: metrics.repairJobsMetrics?.completedRepairJobsToday ?? DEFAULT_CARD_METRIC_TEXT,
    },
    {
      id: 6,
      ...COMMON_METRIC_CARD_STYLES,
      icon: <MdOutlineWarningAmber className={COMMON_METRIC_CARD_ICON_STYLES} />,
      title: KeyMetricCardTitle.OverdueRepairJobs,
      metric: metrics.repairJobsMetrics?.overdueRepairJobs ?? DEFAULT_CARD_METRIC_TEXT,
    },
    {
      id: 7,
      ...COMMON_METRIC_CARD_STYLES,
      icon: <FaUsers className={COMMON_METRIC_CARD_ICON_STYLES} />,
      title: KeyMetricCardTitle.AvailableTechnicians,
      metric: metrics.technicianRecordsMetrics?.availableTechnicians ?? DEFAULT_CARD_METRIC_TEXT,
    },
  ];
};
