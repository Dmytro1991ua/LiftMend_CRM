import dynamic from 'next/dynamic';

import { AdditionalChatConfigFields, ChartType } from '../types';

// Dynamically import GaugeChart, disable SSR to avoid Error: require() of ES Module
const GaugeChart = dynamic(() => import('react-gauge-chart'), { ssr: false });

export type BaseGaugeChartProps = {
  value: number;
  className?: string;
  additionalChartConfigFields?: AdditionalChatConfigFields[ChartType.Gauge];
};

const BaseGaugeChart = ({ value, className, additionalChartConfigFields }: BaseGaugeChartProps) => {
  const chartPercent = Math.min(Math.max(value, 0), 100) / 100;

  return <GaugeChart id='gauge-chart' percent={chartPercent} {...additionalChartConfigFields} className={className} />;
};

export default BaseGaugeChart;
