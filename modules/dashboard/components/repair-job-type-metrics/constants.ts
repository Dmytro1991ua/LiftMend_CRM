import { AdditionalChatConfigFields, ChartConfig, ChartType } from '@/shared/base-charts/types';

export const REPAIR_JOB_TYPE_CHART_CONFIG: ChartConfig = {
  Repair: { label: 'Repair', color: '#3b82f6' },
  Mentainance: { label: 'Mentainance', color: '#3b82f6' },
  Installation: { label: 'Installation', color: '#3b82f6' },
  Inspection: { label: 'Inspection', color: '#3b82f6' },
  Upgrade: { label: 'Upgrade', color: '#3b82f6' },
  Emergency: { label: 'Emergency', color: '#3b82f6' },
  Routine: { label: 'Routine', color: '#3b82f6' },
  Consultation: { label: 'Consultation', color: '#3b82f6' },
  Modernization: { label: 'Modernization', color: '#3b82f6' },
  Compliance: { label: 'Compliance', color: '#3b82f6' },
};

export const ADDITIONAL_CHART_CONFIG_FIELDS: AdditionalChatConfigFields = {
  [ChartType.Bar]: {
    dataKey: 'value',
    nameKey: 'name',
    radius: 15,
    isXAxisHidden: true,
    isYAxisHidden: true,
    hasSingleChartColor: true,
    chartColor: '#3b82f6',
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
    primaryLabelColor: '#ffff',
  },
};

export const DEFAULT_ERROR_RESPONSE_MESSAGE = 'Failed to fetch repair job type metrics';
export const REPAIR_JOB_TYPE_CHART_TITLE = 'Repair Job Type Overview';
export const REPAIR_JOB_TYPE_CHART_DESCRIPTION =
  'This chart visualizes different repair job types, offering a quick view of their distribution across various categories like Repair, Maintenance, Installation, and more.';
