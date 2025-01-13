export enum ChartType {
  Pie = 'Pie',
}

export interface BaseChartProps {
  data: ChartData[];
  config: ChartConfig;
  additionalChartConfigFields?: AdditionalChatConfigFields;
  chartType: ChartType;
  className?: string;
}

export type ChartData = {
  name: string;
  value: number;
  fill: string;
};

export type ChartConfig = Record<string, { label: string; color: string }>;

export type AdditionalChatConfigFields = Record<
  ChartType,
  {
    //Common fields
    nameKey?: string;
    dataKey: string;

    // Pie Chart
    innerRadius?: number;
    outerRadius?: number;
    strokeWidth?: number;
    hasLayerLabel?: boolean;
    chartTitle?: string;
    chartTotalValue?: number;
    shouldShowLabel?: boolean;
  }
>;
