import { render, screen } from '@testing-library/react';

import { withApolloProvider } from '@/mocks/testMocks';
import TechnicianManagement from '@/modules/technician-management';
import { SectionHeaderDescription, SectionHeaderTitle } from '@/types/enums';

describe('TechnicianManagement', () => {
  const TechnicianManagementComponent = () => withApolloProvider(<TechnicianManagement />);

  it('should render component without crashing', () => {
    render(<TechnicianManagementComponent />);

    expect(screen.getByText(SectionHeaderTitle.TechnicianManagement)).toBeInTheDocument();
    expect(screen.getByText(SectionHeaderDescription.TechnicianManagement)).toBeInTheDocument();
    expect(screen.getByTestId('base-table')).toBeInTheDocument();
  });
});
