import { render, screen } from '@testing-library/react';

import Dashboard from '@/modules/dashboard';
import { SectionHeaderTitle } from '@/types/enums';

describe('Dashboard', () => {
  it('should render component without crashing', () => {
    render(<Dashboard />);
    expect(screen.getByText(SectionHeaderTitle.Dashboard)).toBeInTheDocument();
    expect(screen.getByText('Dashboard content')).toBeInTheDocument();
  });
});
