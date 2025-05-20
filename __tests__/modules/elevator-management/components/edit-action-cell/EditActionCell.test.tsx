import { QueryResult, useQuery } from '@apollo/client';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { mockElevatorManagementDropdownOptions } from '@/mocks/dropdownOptions';
import { mockElevatorRecord } from '@/mocks/elevatorManagementMocks';
import { withApolloAndFormProvider } from '@/mocks/testMocks';
import EditActionCell from '@/modules/elevator-management/components/edit-action-cell';
import { EditActionCellProps } from '@/modules/elevator-management/components/edit-action-cell/EditActionCell';
import useEditElevatorRecordForm from '@/modules/elevator-management/components/edit-elevator-record-form/hooks/useEditElevatorRecordForm';

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useQuery: jest.fn(),
}));
jest.mock('@/modules/elevator-management/components/edit-elevator-record-form/hooks/useEditElevatorRecordForm');

describe('EditActionCell', () => {
  const mockOnEditElevatorRecord = jest.fn();

  beforeEach(() => {
    (useQuery as jest.Mock).mockImplementation(() => {
      return {
        data: {
          getElevatorRecordFormData: mockElevatorManagementDropdownOptions,
        },
        loading: false,
      } as unknown as QueryResult;
    });

    (useEditElevatorRecordForm as jest.Mock).mockReturnValue({
      onEditElevatorRecord: mockOnEditElevatorRecord,
      isUpdateRecordLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const EditActionCellComponent = (props?: Partial<EditActionCellProps>) =>
    withApolloAndFormProvider(<EditActionCell elevatorRecord={mockElevatorRecord} {...props} />);

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

  it('should close Edit Elevator record modal on Cancel button click', async () => {
    render(EditActionCellComponent());

    const button = screen.getByRole('button');

    await userEvent.click(button);

    const cancelButtonClick = screen.getByText('Cancel');

    await userEvent.click(cancelButtonClick);

    expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
    expect(screen.queryByText('Edit Scenic Elevator Information')).not.toBeInTheDocument();
  });
});
