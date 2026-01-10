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

import { KeyMetricCardTitle } from './types';

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
