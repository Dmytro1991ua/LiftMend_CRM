import { render, screen } from '@testing-library/react';

import { mockBenjaminHallRecord } from '@/mocks/technicianManagementMocks';
import { withApolloProvider } from '@/mocks/testMocks';
import DeleteActionCell from '@/modules/technician-management/components/delete-action-cell/DeleteActionCell';

describe('DeleteActionCell', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const DeleteActionCellComponent = () =>
    withApolloProvider(<DeleteActionCell technicianRecord={mockBenjaminHallRecord} />);

  it('should render component without crashing', () => {
    render(DeleteActionCellComponent());

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('trash-icon')).toBeInTheDocument();
  });
});
