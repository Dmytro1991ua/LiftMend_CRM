import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import BaseCard from '@/shared/base-card';

describe('BaseCard', () => {
  const mockTooltipMessage = 'Test Tooltip Message';
  const mockInfoTooltipProps = {
    id: 'test-tooltip-id',
    message: mockTooltipMessage,
    className: '',
    iconSize: '12',
    iconClassName: '',
  };

  const defaultProps = {
    title: 'Test Card Title',
    cardClassName: '',
    description: 'Test Card Description',
    children: <p>Test Card Content</p>,
    footerContent: null,
    footerClassName: '',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render component without crashing', () => {
    render(<BaseCard {...defaultProps} />);

    expect(screen.getByText('Test Card Title')).toBeInTheDocument();
    expect(screen.getByText('Test Card Description')).toBeInTheDocument();
  });

  it('should render footer content if footerContent props is provided', () => {
    render(<BaseCard {...defaultProps} footerContent={<p>Test Footer Content</p>} />);

    expect(screen.getByTestId('base-card-footer')).toBeInTheDocument();
    expect(screen.getByText('Test Footer Content')).toBeInTheDocument();
  });

  it('should not render footer content if footerContent prop is null', () => {
    render(<BaseCard {...defaultProps} footerContent={null} />);

    expect(screen.queryByTestId('base-card-footer')).not.toBeInTheDocument();
  });

  it('should render info tooltip if infoTooltip prop is provided', async () => {
    render(<BaseCard {...defaultProps} infoTooltip={mockInfoTooltipProps} />);

    const icon = screen.getByTestId('info-icon');

    await userEvent.hover(icon);

    expect(screen.getByText(mockTooltipMessage)).toBeInTheDocument();
  });
});
