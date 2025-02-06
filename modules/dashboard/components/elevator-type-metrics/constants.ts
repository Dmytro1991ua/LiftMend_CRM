import { AdditionalChatConfigFields, ChartConfig, ChartType } from '@/shared/base-charts/types';

export const ELEVATOR_TYPE_CHART_CONFIG: ChartConfig = {
  Passenger: { label: 'Passenger', color: '#2196F3' },
  Freight: { label: 'Freight', color: '#8E24AA' },
  Service: { label: 'Service', color: '#009688' },
  Home: { label: 'Home', color: '#FF5722' },
  'Luxury High Speed': { label: 'Luxury High Speed', color: '#FFD700' },
  'Vehicle Parking': { label: 'Vehicle Parking', color: '#3F51B5' },
  Specialty: { label: 'Specialty', color: '#795548' },
};

export const ADDITIONAL_CHART_CONFIG_FIELDS: AdditionalChatConfigFields = {
  [ChartType.Pie]: {
    dataKey: 'value',
    nameKey: 'name',
    innerRadius: 0,
    outerRadius: 110,
    hasLayerLabel: false,
    shouldShowLabel: false,
    shouldShowChartLegend: true,
    chartLegendClassName: 'hidden lg:flex translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center',
  },
};

export const DEFAULT_ERROR_RESPONSE_MESSAGE = 'Failed to fetch elevator type metrics';
export const ELEVATOR_TYPE_CHART_TITLE = 'Elevator Type Categorization Overview';
export const ELEVATOR_TYPE_CHART_DESCRIPTION =
  'This chart categorizes elevators into types such as Passenger, Freight, Home,etc., showcasing their distribution based on function and use.';
