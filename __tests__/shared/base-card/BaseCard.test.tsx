import { render, screen } from '@testing-library/react';

import BaseCard from '@/shared/base-card';

describe('BaseCard', () => {
  const defaultProps = {
    title: 'Test Card Title',
    cardClassName: '',
    description: 'Test Card Description',
    children: <p>Test Card Content</p>,
    footerContent: null,
    footerClassName: '',
  };

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
});
