import { render, screen } from '@testing-library/react';

import InfoTooltip from '@/shared/base-tooltip/info-tooltip/InfoTooltip';

describe('InfoTooltip', () => {
  const defaultProps = {
    id: 'test_id',
    message: 'Test Message',
  };

  it('should render component without crashing', () => {
    render(<InfoTooltip {...defaultProps} />);

    expect(screen.getByTestId('tooltip-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('info-icon')).toBeInTheDocument();
  });
});
