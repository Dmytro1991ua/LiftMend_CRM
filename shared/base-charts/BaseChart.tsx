import BaseBarChart from './base-bar-chart';
import { BaseGaugeChart } from './base-gauge-chart';
import BasePieChart from './base-pie-chart';
import { BaseChartProps, ChartType } from './types';

const BaseChart = ({ data, className, config, chartType, additionalChartConfigFields }: BaseChartProps) => {
  const CHARTS_CONFIG: Record<ChartType, React.JSX.Element> = {
    [ChartType.Pie]: (
      <BasePieChart
        additionalChartConfigFields={additionalChartConfigFields?.[ChartType.Pie]}
        className={className}
        config={config}
        data={data}
      />
    ),
    [ChartType.Bar]: (
      <BaseBarChart
        additionalChartConfigFields={additionalChartConfigFields?.[ChartType.Bar]}
        className={className}
        config={config}
        data={data}
      />
    ),
    [ChartType.Gauge]: (
      <BaseGaugeChart
        additionalChartConfigFields={additionalChartConfigFields?.[ChartType.Gauge]}
        className={className}
        value={data[0]?.value}
      />
    ),
  };

  return <section>{CHARTS_CONFIG[chartType]}</section>;
};

export default BaseChart;
