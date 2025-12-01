import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { HealthScoreLabel } from '@/modules/elevator-management/types';
import BaseScoreDots, { BaseScoreDotsProps } from '@/shared/base-score-cell/base-score-dots/BaseScoreDots';
import { DEFAULT_SCORE_THRESHOLD_LABEL, DEFAULT_TOTAL_DOTS } from '@/shared/base-score-cell/constants';

describe('BaseScoreDots', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    scoreLevel: null,
  };

  const BaseScoreDotsComponent = (props?: Partial<BaseScoreDotsProps<HealthScoreLabel>>) => (
    <BaseScoreDots {...defaultProps} {...props} />
  );

  it('should render default N/A label when scoreLevel is null', () => {
    render(BaseScoreDotsComponent());

    expect(screen.getByText(DEFAULT_SCORE_THRESHOLD_LABEL)).toBeInTheDocument();
  });

  it('should render score dots based on scoreLevel', () => {
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

    render(BaseScoreDotsComponent({ scoreLevel: mockHealthScoreLevel }));

    const healthScoreDots = screen.getAllByTestId('score-dot');

    expect(healthScoreDots).toHaveLength(DEFAULT_TOTAL_DOTS);
    expect(healthScoreDots[0]).toHaveClass('bg-yellow-400');
    expect(healthScoreDots[1]).toHaveClass('bg-yellow-400');
    expect(healthScoreDots[2]).toHaveClass('bg-gray-300 ');
  });

  it('should show a tooltip message on hover over score dots', async () => {
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

    render(BaseScoreDotsComponent({ scoreLevel: mockHealthScoreLevel }));

    const scoreThresholdsDotsContainer = screen.getByTestId('score-dot-container');

    await userEvent.hover(scoreThresholdsDotsContainer);

    expect(screen.getByText('Test tooltip message')).toBeInTheDocument();
  });
});
