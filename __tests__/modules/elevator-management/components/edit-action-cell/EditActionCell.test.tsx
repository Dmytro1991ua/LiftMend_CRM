import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { mockElevatorRecord } from '@/mocks/elevatorManagementMocks';
import { withApolloProvider } from '@/mocks/testMocks';
import EditActionCell from '@/modules/elevator-management/components/edit-action-cell';
import { EditActionCellProps } from '@/modules/elevator-management/components/edit-action-cell/EditActionCell';

describe('EditActionCell', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const EditActionCellComponent = (props?: Partial<EditActionCellProps>) =>
    withApolloProvider(<EditActionCell elevatorRecord={mockElevatorRecord} {...props} />);

  it('should render component without crashing', () => {
    render(EditActionCellComponent());

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
  });

  it('should disable edit icon if elevator record status is Out of Service', () => {
    render(
      EditActionCellComponent({
        elevatorRecord: { ...mockElevatorRecord, status: 'Out of Service' },
      })
    );

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should open Edit form on edit icon click', async () => {
    render(EditActionCellComponent());

    const editIconButton = screen.getByRole('button');

    await act(async () => await userEvent.click(editIconButton));

    expect(screen.getByText('Edit Scenic Elevator Information')).toBeInTheDocument();

    expect(screen.getByText('Edit')).toBeInTheDocument();

    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });
});
