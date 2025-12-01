import { render, screen } from '@testing-library/react';

import { withApolloProvider } from '@/mocks/testMocks';
import BaseScoreCell from '@/shared/base-score-cell/BaseScoreCell';

describe('BaseScoreCell', () => {
  const mockScore = 84;
  const mockScoreThresholds = [
    {
      value: 90,
      label: 'Excellent',
      color: '#22c55e',
      classes: {
        background: 'bg-green-500',
        text: 'text-green-600',
        border: 'border-green-500',
      },
      activeDots: 4,
      tooltipProps: {
        id: 'Excellent',
        getTooltipMessage: jest.fn(),
      },
    },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  const BaseScoreCellComponent = () =>
    withApolloProvider(<BaseScoreCell score={mockScore} scoreThresholds={mockScoreThresholds} />);

  it('should render component without crashing', () => {
    render(BaseScoreCellComponent());

    expect(screen.getByTestId('base-score-cell')).toBeInTheDocument();
  });
});
