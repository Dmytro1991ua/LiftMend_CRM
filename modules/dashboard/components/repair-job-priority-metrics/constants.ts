import { AdditionalChatConfigFields, ChartConfig, ChartType } from '@/shared/base-charts/types';

export const REPAIR_JOB_PRIORITY_CHART_CONFIG: ChartConfig = {
  Low: { label: 'Low', color: '#22c55e' },
  Medium: { label: 'Medium', color: '#eab308' },
  High: { label: 'High', color: '#ef4444' },
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
      right: 25,
    },
    barSettings: {
      barCategoryGap: '20%',
    },
    layout: 'vertical',
    secondaryLabelColor: '#6b7280',
    primaryLabelClassName: 'font-bold',
  },
};

export const DEFAULT_ERROR_RESPONSE_MESSAGE = 'Failed to fetch repair job priority metrics';
export const REPAIR_JOB_PRIORITY_CHART_TITLE = 'Repair Job Priority Overview';
export const REPAIR_JOB_PRIORITY_CHART_DESCRIPTION =
  'This chart highlights repair job priorities, providing a quick view of jobs categorized as Low, Medium, or High.';
