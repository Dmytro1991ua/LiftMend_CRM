import { Maybe } from 'graphql/jsutils/Maybe';
import { BiCalendarCheck } from 'react-icons/bi';
import { FaCheckCircle, FaExclamationTriangle, FaTools } from 'react-icons/fa';
import { FaClock } from 'react-icons/fa6';
import { MdWork } from 'react-icons/md';

import { TechnicianPerformanceMetrics } from '@/graphql/types/client/generated_types';
import {
  COMMON_METRIC_CARD_ICON_STYLES,
  COMMON_METRIC_CARD_STYLES,
  DEFAULT_CARD_METRIC_TEXT,
} from '@/shared/base-app-metrics/constants';
import { BaseMetricsConfig } from '@/shared/base-app-metrics/types';

import { TechnicianPerformanceMetricsTitle } from './types';

export const ON_TIME_COMPLETION_TOOLTIP_MESSAGE = 'Percentage of completed jobs finished on or before planned end date';
export const AVERAGE_REPAIR_JOB_DURATION_TOOLTIP_MESSAGE = 'Average number of days to complete a repair job';

export const getTechnicianPerformanceMetricsConfig = (
  metrics: Maybe<TechnicianPerformanceMetrics>
): BaseMetricsConfig<TechnicianPerformanceMetricsTitle>[] => {
  const COMMON_INFO_TOOLTIP_ICON_STYLES = {
    className: 'w-[33rem]',
    iconSize: '13',
    iconClassName: 'transform -translate-y-2.5',
  };

  return [
    {
      id: 1,
      ...COMMON_METRIC_CARD_STYLES,
      icon: <FaTools className={COMMON_METRIC_CARD_ICON_STYLES} />,
      title: TechnicianPerformanceMetricsTitle.TotalRepairJobs,
      metric: metrics?.totalRepairJobs ?? DEFAULT_CARD_METRIC_TEXT,
    },
    {
      id: 2,
      ...COMMON_METRIC_CARD_STYLES,
      icon: <MdWork className={COMMON_METRIC_CARD_ICON_STYLES} />,
      title: TechnicianPerformanceMetricsTitle.ActiveRepairJobs,
      metric: metrics?.activeRepairJobs ?? DEFAULT_CARD_METRIC_TEXT,
    },
    {
      id: 3,
      ...COMMON_METRIC_CARD_STYLES,
      icon: <FaCheckCircle className={COMMON_METRIC_CARD_ICON_STYLES} />,
      title: TechnicianPerformanceMetricsTitle.CompletedRepairJobsJobs,
      metric: metrics?.completedRepairJobs ?? DEFAULT_CARD_METRIC_TEXT,
    },
    {
      id: 4,
      ...COMMON_METRIC_CARD_STYLES,
      icon: <FaExclamationTriangle className={COMMON_METRIC_CARD_ICON_STYLES} />,
      title: TechnicianPerformanceMetricsTitle.OverdueRepairJobs,
      metric: metrics?.overdueRepairJobs ?? DEFAULT_CARD_METRIC_TEXT,
    },
    {
      id: 5,
      ...COMMON_METRIC_CARD_STYLES,
      icon: <BiCalendarCheck className={COMMON_METRIC_CARD_ICON_STYLES} />,
      title: TechnicianPerformanceMetricsTitle.OnTimeCompletion,
      metric: metrics?.onTimeCompletionRate ? `${metrics.onTimeCompletionRate}%` : DEFAULT_CARD_METRIC_TEXT,
      infoTooltip: {
        id: 'on-time-completion',
        message: ON_TIME_COMPLETION_TOOLTIP_MESSAGE,
        ...COMMON_INFO_TOOLTIP_ICON_STYLES,
      },
    },
    {
      id: 6,
      ...COMMON_METRIC_CARD_STYLES,
      icon: <FaClock className={COMMON_METRIC_CARD_ICON_STYLES} />,
      title: TechnicianPerformanceMetricsTitle.AverageRepairJobDuration,
      metric: metrics?.averageDurationDays ? `${metrics.averageDurationDays} days` : DEFAULT_CARD_METRIC_TEXT,
      infoTooltip: {
        id: 'average job duration',
        message: AVERAGE_REPAIR_JOB_DURATION_TOOLTIP_MESSAGE,
        ...COMMON_INFO_TOOLTIP_ICON_STYLES,
      },
    },
  ];
};
