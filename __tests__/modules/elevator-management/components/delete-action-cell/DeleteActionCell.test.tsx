import { render, screen } from '@testing-library/react';

import { mockElevatorRecord } from '@/mocks/elevatorManagementMocks';
import { withApolloProvider } from '@/mocks/testMocks';
import DeleteActionCell from '@/modules/elevator-management/components/delete-action-cell';

describe('DeleteActionCell', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const DeleteActionCellComponent = () => withApolloProvider(<DeleteActionCell elevatorRecord={mockElevatorRecord} />);

  it('should render component without crashing', () => {
    render(DeleteActionCellComponent());

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('trash-icon')).toBeInTheDocument();
  });
});
