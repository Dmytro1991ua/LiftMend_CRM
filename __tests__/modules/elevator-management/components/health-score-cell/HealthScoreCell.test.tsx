import { render, screen } from '@testing-library/react';

import { withApolloProvider } from '@/mocks/testMocks';
import { HealthScoreCell } from '@/modules/elevator-management/components/health-score-cell';

describe('HealthScoreCell', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const HealthScoreCellComponent = () => withApolloProvider(<HealthScoreCell healthScore={84} />);

  it('should render component without crashing', () => {
    render(HealthScoreCellComponent());

    expect(screen.getByTestId('health-score-cell')).toBeInTheDocument();
  });
});
