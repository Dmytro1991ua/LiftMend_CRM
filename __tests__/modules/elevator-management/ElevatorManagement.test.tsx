import { render, screen } from '@testing-library/react';

import { MockProviderHook } from '@/mocks/testMocks';
import ElevatorManagement from '@/modules/elevator-management';
import { SectionHeaderTitle } from '@/types/enums';

describe('ElevatorManagement', () => {
  const ElevatorManagementComponent = () => (
    <MockProviderHook mocks={[]}>
      <ElevatorManagement />
    </MockProviderHook>
  );

  it('should render component without crashing', () => {
    render(<ElevatorManagementComponent />);

    expect(screen.getByText(SectionHeaderTitle.ElevatorManagement)).toBeInTheDocument();
    expect(screen.getByTestId('base-table')).toBeInTheDocument();
  });
});
