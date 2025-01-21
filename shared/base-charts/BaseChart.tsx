import BaseBarChart from './base-bar-chart';
import BasePieChart from './base-pie-chart';
import { BaseChartProps, ChartType } from './types';

const BaseChart = ({ data, className, config, chartType, additionalChartConfigFields }: BaseChartProps) => {
  const CHARTS_CONFIG: Record<ChartType, React.JSX.Element> = {
    [ChartType.Pie]: (
      <BasePieChart
        additionalChartConfigFields={additionalChartConfigFields?.[chartType]}
        className={className}
        config={config}
        data={data}
      />
    ),
    [ChartType.Bar]: (
      <BaseBarChart
        additionalChartConfigFields={additionalChartConfigFields?.[chartType]}
        className={className}
        config={config}
        data={data}
      />
    ),
  };

  return <section>{CHARTS_CONFIG[chartType]}</section>;
};

export default BaseChart;
