import { render, screen } from '@testing-library/react';

import { PILL_CONFIG, PillStatus } from '@/shared/pill/config';
import Pill from '@/shared/pill/Pill';

describe('Pill', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it.each(Object.entries(PILL_CONFIG))('should render correct pill for status: %s', (statusKey, config) => {
    render(<Pill status={statusKey as PillStatus} />);

    const labelElement = screen.getByText(config.label);

    expect(screen.getByTestId(config.icon.props['data-testid'])).toBeInTheDocument();
    expect(labelElement).toBeInTheDocument();
    expect(labelElement).toHaveClass(config.className ?? '');
  });

  it('should render nothing when status is not defined in PILL_CONFIG', () => {
    render(<Pill status={'UnknownStatus' as PillStatus} />);

    const pillLabel = screen.getByTestId('pill-label');

    expect(screen.queryByTestId(/-status$/)).not.toBeInTheDocument();
    expect(pillLabel).toBeInTheDocument();
    expect(pillLabel).toHaveTextContent('');
  });
});
