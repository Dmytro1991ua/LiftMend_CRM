import { AiOutlineCheckCircle } from 'react-icons/ai';
import { FaCogs, FaTools, FaUserCog } from 'react-icons/fa';
import { FaElevator, FaUsers } from 'react-icons/fa6';
import { MdOutlineWarningAmber } from 'react-icons/md';

import { DashboardMetrics } from '@/graphql/types/client/generated_types';

import { DEFAULT_CARD_METRIC_TEXT } from './constants';
import { CommonCardStyles, KeyMetricCardTitle, KeyMetricsConfig } from './types';

export const getKeyMetricsConfig = (metrics: DashboardMetrics): KeyMetricsConfig[] => {
  const commonCardStyles: Record<CommonCardStyles, string> = {
    cardClassName: 'flex-shrink-0 basis-2/5 max-w-2/5 2xl:flex-shrink-0 2xl:basis-1/5 2xl:max-w-1/5',
    cardHeaderClassName: 'bg-primary text-white text-lg',
    cardTittleClassName: 'text-lg !mt-0',
    cardContentClassName: 'bg-blue-100',
  };
  const commonIconStyles = 'w-4 h-4';

  return [
    {
      id: 1,
      ...commonCardStyles,
      icon: <FaTools className={commonIconStyles} />,
      title: KeyMetricCardTitle.TotalRepairJobs,
      metric: metrics.repairJobsMetrics?.totalRepairJobs ?? 'N/A',
    },
    {
      id: 2,
      ...commonCardStyles,
      icon: <FaElevator className={commonIconStyles} />,
      title: KeyMetricCardTitle.TotalElevators,
      metric: metrics.elevatorRecordsMetrics?.totalElevatorRecords ?? DEFAULT_CARD_METRIC_TEXT,
    },
    {
      id: 3,
      ...commonCardStyles,
      icon: <FaUserCog className={commonIconStyles} />,
      title: KeyMetricCardTitle.TotalTechnicians,
      metric: metrics.technicianRecordsMetrics?.totalTechnicianRecords ?? DEFAULT_CARD_METRIC_TEXT,
    },
    {
      id: 4,
      ...commonCardStyles,
      icon: <FaCogs className={commonIconStyles} />,
      title: KeyMetricCardTitle.OngoingRepairJobs,
      metric: metrics.repairJobsMetrics?.ongoingRepairJobs ?? DEFAULT_CARD_METRIC_TEXT,
    },
    {
      id: 5,
      ...commonCardStyles,
      icon: <AiOutlineCheckCircle className={commonIconStyles} />,
      title: KeyMetricCardTitle.CompletedTodayJobs,
      metric: metrics.repairJobsMetrics?.completedRepairJobsToday ?? DEFAULT_CARD_METRIC_TEXT,
    },
    {
      id: 6,
      ...commonCardStyles,
      icon: <MdOutlineWarningAmber className={commonIconStyles} />,
      title: KeyMetricCardTitle.OverdueRepairJobs,
      metric: metrics.repairJobsMetrics?.overdueRepairJobs ?? DEFAULT_CARD_METRIC_TEXT,
    },
    {
      id: 7,
      ...commonCardStyles,
      icon: <FaUsers className={commonIconStyles} />,
      title: KeyMetricCardTitle.AvailableTechnicians,
      metric: metrics.technicianRecordsMetrics?.availableTechnicians ?? DEFAULT_CARD_METRIC_TEXT,
    },
  ];
};
