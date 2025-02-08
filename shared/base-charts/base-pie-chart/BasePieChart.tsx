import { Label, Pie, PieChart } from 'recharts';

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { DEFAULT_FALLBACK_MESSAGE } from '../constants';
import { AdditionalChatConfigFields, BaseChartProps, ChartType } from '../types';

interface BasePieChartProps extends Omit<BaseChartProps, 'additionalChartConfigFields' | 'chartType'> {
  additionalChartConfigFields?: AdditionalChatConfigFields[ChartType.Pie];
}

const BasePieChart = ({ data, config, className, additionalChartConfigFields }: BasePieChartProps) => {
  const {
    innerRadius = 70,
    outerRadius = 80,
    strokeWidth = 0,
    hasLayerLabel = false,
    chartTitle,
    chartTotalValue,
    shouldShowLabel = false,
    shouldShowChartLegend = false,
    chartLegendClassName = '',
    nameKey = '',
    dataKey = '',
  } = additionalChartConfigFields || {};

  const isFallbackMessageShown = data.every(({ value }) => value === 0);

  const renderChartLabel = (
    <>
      {shouldShowLabel ? (
        <Label
          content={({ viewBox }) => {
            if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
              return (
                <text dominantBaseline='middle' textAnchor='middle' x={viewBox.cx} y={viewBox.cy}>
                  <tspan className='fill-foreground text-3xl font-bold' x={viewBox.cx} y={viewBox.cy}>
                    {chartTotalValue}
                  </tspan>
                  <tspan className='fill-muted-foreground' x={viewBox.cx} y={(viewBox.cy || 0) + 24}>
                    {chartTitle}
                  </tspan>
                </text>
              );
            }
          }}
        />
      ) : null}
    </>
  );

  const renderChartLegend = (
    <>
      {shouldShowChartLegend ? (
        <ChartLegend className={chartLegendClassName} content={<ChartLegendContent nameKey='name' />} />
      ) : null}
    </>
  );

  if (isFallbackMessageShown) {
    return <p className='flex h-96 flex-col items-center justify-center font-bold'>{DEFAULT_FALLBACK_MESSAGE}</p>;
  }

  return (
    <ChartContainer className={className} config={config}>
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={data}
          dataKey={dataKey}
          innerRadius={innerRadius}
          label={hasLayerLabel}
          nameKey={nameKey}
          outerRadius={outerRadius}
          strokeWidth={strokeWidth}
        >
          {renderChartLabel}
        </Pie>
        {renderChartLegend}
      </PieChart>
    </ChartContainer>
  );
};

export default BasePieChart;
