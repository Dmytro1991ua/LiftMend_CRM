import { render, screen } from '@testing-library/react';

import ElevatorManagement from '@/modules/elevator-management';

describe('ElevatorManagement', () => {
  it('should render component without crashing', () => {
    render(<ElevatorManagement />);

    expect(screen.getByText('Section Header')).toBeInTheDocument();
    expect(screen.getByText('Elevator Management content')).toBeInTheDocument();
  });
});
