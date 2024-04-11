import { render, screen } from '@testing-library/react';

import ElevatorManagement from '@/modules/elevator-management';
import { SectionHeaderTitle } from '@/types/enums';

describe('ElevatorManagement', () => {
  it('should render component without crashing', () => {
    render(<ElevatorManagement />);

    expect(screen.getByText(SectionHeaderTitle.ElevatorManagement)).toBeInTheDocument();
    expect(screen.getByTestId('base-table')).toBeInTheDocument();
  });
});
