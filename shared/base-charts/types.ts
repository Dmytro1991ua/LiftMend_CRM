export enum ChartType {
  Pie = 'Pie',
  Bar = 'Bar',
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
  fill?: string;
};

export type ChartConfig = Record<string, { label: string; color: string }>;

export type PieChartConfig = {
  dataKey?: string;
  innerRadius?: number;
  nameKey?: string;
  outerRadius?: number;
  strokeWidth?: number;
  hasLayerLabel?: boolean;
  chartTitle?: string;
  chartTotalValue?: number;
  shouldShowLabel?: boolean;
};

export type BarChartConfig = {
  dataKey?: string;
  nameKey?: string;
  tickLine?: boolean;
  tickMargin?: number;
  axisLine?: boolean;
  tickFormatter?: (value: number) => void;
  radius?: number;
  isGridVertical?: boolean;
  indicator?: 'line' | 'dot' | 'dashed';
  layout?: 'horizontal' | 'vertical';
  isXAxisHidden?: boolean;
  isYAxisHidden?: boolean;
  hasSingleChartColor?: boolean;
  chartColor?: string;
  barChartMargin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  primaryLabelClassName?: string;
  primaryLabelColor?: string;
  secondaryLabelClassName?: string;
  secondaryLabelColor?: string;
  showTooltipCursor?: boolean;
  barSettings?: {
    barCategoryGap?: number | string;
    barGap?: number;
    barSize?: 120;
  };
};

export type AdditionalChatConfigFields = {
  [ChartType.Pie]?: PieChartConfig;
  [ChartType.Bar]?: BarChartConfig;
};
