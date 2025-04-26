import { render, screen } from '@testing-library/react';

import { withApolloProvider } from '@/mocks/testMocks';
import ElevatorManagement from '@/modules/elevator-management';
import { SectionHeaderDescription, SectionHeaderTitle } from '@/types/enums';

describe('ElevatorManagement', () => {
  const ElevatorManagementComponent = () => withApolloProvider(<ElevatorManagement />);

  it('should render component without crashing', () => {
    render(<ElevatorManagementComponent />);

    expect(screen.getByText(SectionHeaderTitle.ElevatorManagement)).toBeInTheDocument();
    expect(screen.getByText(SectionHeaderDescription.ElevatorManagement)).toBeInTheDocument();
    expect(screen.getByTestId('base-table')).toBeInTheDocument();
  });
});
