import { render, screen } from '@testing-library/react';

import { withApolloProvider } from '@/mocks/testMocks';
import InventoryManagement from '@/modules/inventory-management';
import { SectionHeaderDescription, SectionHeaderTitle } from '@/types/enums';

describe('InventoryManagement', () => {
  const InventoryManagementComponent = () => withApolloProvider(<InventoryManagement />);

  it('should render component without crashing', () => {
    render(<InventoryManagementComponent />);

    expect(screen.getByText(SectionHeaderTitle.InventoryManagement)).toBeInTheDocument();
    expect(screen.getByText(SectionHeaderDescription.InventoryManagement)).toBeInTheDocument();
  });
});
