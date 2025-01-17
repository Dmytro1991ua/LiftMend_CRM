import { ChartConfig } from '@/shared/base-charts/types';

export const ELEVATOR_STATUS_CHART_CONFIG: ChartConfig = {
  Operational: { label: 'Operational', color: '#166534' },
  UnderMentainance: { label: 'Under Mentainance', color: '#a16207' },
  OutOfService: { label: 'Out of Service', color: '#b91c1c' },
  Paused: { label: 'Paused', color: '#1d4ed8' },
};

export const DEFAULT_ERROR_RESPONSE_MESSAGE = 'Failed to fetch elevator status metrics';
export const ELEVATOR_STATUS_CHART_TITLE = 'Elevator Status Overview';
export const ELEVATOR_STATUS_CHART_DESCRIPTION =
  'This chart highlights elevator statuses, offering a quick view of operational and maintenance conditions.';
