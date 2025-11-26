import { render, screen } from '@testing-library/react';

import BaseGaugeChart, { BaseGaugeChartProps } from '@/shared/base-charts/base-gauge-chart/BaseGaugeChart';

jest.mock('next/dynamic', () => {
  return () => {
    const TestMock = (props: Record<string, unknown>) => <div data-testid='gauge-chart' {...props} />;

    TestMock.displayName = 'TestMock';

    return TestMock;
  };
});

describe('BaseGaugeChart', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    value: 30,
    className: '',
    additionalChartConfigFields: {
      hideText: true,
      nrOfLevels: 3,
      colors: ['red', 'yellow', 'green'],
    },
  };

  const BaseGaugeChartComponent = (props?: Partial<BaseGaugeChartProps>) => (
    <BaseGaugeChart {...defaultProps} {...props} />
  );

  it('should render gauge chart with correct percent based on value', () => {
    render(BaseGaugeChartComponent());

    const gauge = screen.getByTestId('gauge-chart');

    // value = 30 → percent = 0.3
    expect(gauge).toHaveAttribute('percent', '0.3');
  });
});
