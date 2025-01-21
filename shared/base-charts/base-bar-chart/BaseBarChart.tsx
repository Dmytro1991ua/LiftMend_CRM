import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

import { AdditionalChatConfigFields, BaseChartProps, ChartType } from '../types';

interface BaseBarChartProps extends Omit<BaseChartProps, 'additionalChartConfigFields' | 'chartType'> {
  additionalChartConfigFields?: AdditionalChatConfigFields[ChartType.Bar];
}
const BaseBarChart = ({ config, className, additionalChartConfigFields, data }: BaseBarChartProps) => {
  const {
    axisLine = false,
    tickMargin = 1,
    tickLine = false,
    isGridVertical = false,
    indicator = 'dashed',
    radius = 1,
    dataKey = 'value',
    nameKey = 'name',
    isXAxisHidden = false,
    isYAxisHidden = false,
    hasSingleChartColor = false,
    chartColor,
    layout = 'horizontal',
    barChartMargin = {},
    barSettings = {},
    primaryLabelClassName = '',
    primaryLabelColor = '',
    secondaryLabelClassName = '',
    secondaryLabelColor = '',
    showTooltipCursor = false,
  } = additionalChartConfigFields || {};

  const filteredChartData = data.filter(({ value }) => value !== 0);

  const isVertical = layout === 'vertical';
  const xAxisType = isVertical ? 'number' : 'category';
  const yAxisType = isVertical ? 'category' : 'number';
  const primaryAxisKey = isVertical ? dataKey : nameKey;
  const secondaryAxisKey = isVertical ? nameKey : dataKey;
  const primaryLabelPosition = isVertical ? 'insideLeft' : 'top';
  const secondaryLabelPosition = isVertical ? 'right' : 'bottom';
  const labelOffset = isVertical ? 8 : 16;

  return (
    <ChartContainer className={className} config={config}>
      <BarChart
        data={filteredChartData}
        layout={layout}
        margin={{
          top: barChartMargin?.top,
          right: barChartMargin?.right,
          bottom: barChartMargin?.bottom,
          left: barChartMargin?.left,
        }}
        {...barSettings}>
        <CartesianGrid vertical={isGridVertical} />
        <XAxis
          axisLine={axisLine}
          dataKey={primaryAxisKey}
          hide={isXAxisHidden}
          tickLine={tickLine}
          tickMargin={tickMargin}
          type={xAxisType}
        />
        <YAxis
          axisLine={axisLine}
          dataKey={secondaryAxisKey}
          hide={isYAxisHidden}
          tickLine={tickLine}
          tickMargin={tickMargin}
          type={yAxisType}
        />
        <ChartTooltip content={<ChartTooltipContent indicator={indicator} />} cursor={showTooltipCursor} />
        <Bar dataKey={dataKey} fill={hasSingleChartColor ? chartColor : ''} radius={radius}>
          <LabelList
            className={primaryLabelClassName}
            dataKey={secondaryAxisKey}
            fill={primaryLabelColor}
            offset={labelOffset}
            position={primaryLabelPosition}
          />
          <LabelList
            className={secondaryLabelClassName}
            dataKey={primaryAxisKey}
            fill={secondaryLabelColor}
            offset={labelOffset}
            position={secondaryLabelPosition}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};

export default BaseBarChart;
