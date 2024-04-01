import { render, screen } from '@testing-library/react';

import Dashboard from '@/modules/dashboard';

describe('Dashboard', () => {
  it('should render component without crashing', () => {
    render(<Dashboard />);

    expect(screen.getByText('Section Header')).toBeInTheDocument();
    expect(screen.getByText('Dashboard content')).toBeInTheDocument();
  });
});
