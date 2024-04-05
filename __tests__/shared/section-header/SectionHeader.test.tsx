import { render, screen } from '@testing-library/react';

import SectionHeader from '@/shared/section-header';
import { SectionHeaderTitle } from '@/types/enums';

describe('SectionHeader', () => {
  const mockActionContent = <p>Test Action Component</p>;

  it('should render component without crashing', () => {
    render(<SectionHeader title={SectionHeaderTitle.Dashboard} />);

    expect(screen.getByText(SectionHeaderTitle.Dashboard)).toBeInTheDocument();
  });

  it('should render subtitle if it has been provided', () => {
    render(<SectionHeader subtitle='Test Subtitle' title={SectionHeaderTitle.Dashboard} />);

    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('should correctly assign headerActions based on actionComponent presence', () => {
    render(<SectionHeader actionComponent={mockActionContent} title={SectionHeaderTitle.Dashboard} />);

    const headerActionsWithActionComponent = screen.getByTestId('header-actions');
    expect(headerActionsWithActionComponent).toContainHTML('<p>Test Action Component</p>');
  });

  it('should not render actionComponent if it has not been provided', () => {
    render(<SectionHeader title={SectionHeaderTitle.Dashboard} />);

    expect(screen.queryByText('Test Action Component')).not.toBeInTheDocument();
  });
});
