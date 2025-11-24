import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { HealthScoreDots } from '@/modules/elevator-management/components/health-score-cell/health-score-dots';
import {
  DEFAULT_HEALTH_SCORE_LABEL,
  DEFAULT_TOTAL_DOTS,
} from '@/modules/elevator-management/components/health-score-cell/health-score-dots/constants';
import { HealthScoreDotsProps } from '@/modules/elevator-management/components/health-score-cell/health-score-dots/HealthScoreDots';
import { HealthScoreLabel } from '@/modules/elevator-management/types';

describe('HealthScoreDots', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    healthScoreLevel: null,
  };

  const HealthScoreDotsComponent = (props?: Partial<HealthScoreDotsProps>) => (
    <HealthScoreDots {...defaultProps} {...props} />
  );

  it('should render default N/A label when healthScoreLevel is null', () => {
    render(HealthScoreDotsComponent());

    expect(screen.getByText(DEFAULT_HEALTH_SCORE_LABEL)).toBeInTheDocument();
  });

  it('should render health score dots based on healthScoreLevel', () => {
    const mockHealthScoreLevel = {
      value: 70,
      label: HealthScoreLabel.Fair,
      color: '#facc15',
      classes: {
        background: 'bg-yellow-400',
        text: 'text-yellow-600',
        border: 'border-yellow-400',
      },
      activeDots: 2,
      tooltipProps: {
        id: HealthScoreLabel.Fair,
        getTooltipMessage: jest.fn(),
      },
    };

    render(HealthScoreDotsComponent({ healthScoreLevel: mockHealthScoreLevel }));

    const healthScoreDots = screen.getAllByTestId('health-dot');

    expect(healthScoreDots).toHaveLength(DEFAULT_TOTAL_DOTS);
    expect(healthScoreDots[0]).toHaveClass('bg-yellow-400');
    expect(healthScoreDots[1]).toHaveClass('bg-yellow-400');
    expect(healthScoreDots[2]).toHaveClass('bg-gray-300 ');
  });

  it('should show a tooltip message on hover over health score dots', async () => {
    const mockHealthScoreLevel = {
      value: 98,
      label: HealthScoreLabel.Excellent,
      color: '#22c55e',
      classes: {
        background: 'bg-green-500',
        text: 'text-green-600',
        border: 'border-green-500',
      },
      activeDots: 3,
      tooltipProps: {
        id: HealthScoreLabel.Excellent,
        getTooltipMessage: () => 'Test tooltip message',
      },
    };

    render(HealthScoreDotsComponent({ healthScoreLevel: mockHealthScoreLevel }));

    const healthScoreDotsContainer = screen.getByTestId('health-dot-container');

    await userEvent.hover(healthScoreDotsContainer);

    expect(screen.getByText('Test tooltip message')).toBeInTheDocument();
  });
});
