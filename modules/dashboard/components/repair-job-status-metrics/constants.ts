import { AdditionalChatConfigFields, ChartConfig, ChartType } from '@/shared/base-charts/types';

export const REPAIR_JOB_STATUS_CHART_CONFIG: ChartConfig = {
  Scheduled: { label: 'Scheduled', color: '#3b82f6' },
  InProgress: { label: 'In Progress', color: '#f97316' },
  Completed: { label: 'Completed', color: '#22c55e' },
  OnHold: { label: 'On Hold', color: '#eab308' },
  Cancelled: { label: 'Cancelled', color: '#ef4444' },
};

export const ADDITIONAL_CHART_CONFIG_FIELDS: AdditionalChatConfigFields = {
  [ChartType.Bar]: {
    dataKey: 'value',
    nameKey: 'name',
    radius: 15,
    isXAxisHidden: true,
    isYAxisHidden: true,
    barChartMargin: {
      top: 30,
      bottom: 30,
    },
    barSettings: {
      barCategoryGap: '20%',
    },
    primaryLabelColor: '#6b7280',
    secondaryLabelClassName: 'font-bold',
  },
};

export const DEFAULT_ERROR_RESPONSE_MESSAGE = 'Failed to fetch repair job status metrics';
export const REPAIR_JOB_STATUS_CHART_TITLE = 'Repair Job Status Overview';
export const REPAIR_JOB_STATUS_CHART_DESCRIPTION =
  'This chart highlights repair job statuses, offering a quick overview of their progress through different stages.';