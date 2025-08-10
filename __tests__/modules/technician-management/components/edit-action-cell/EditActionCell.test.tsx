import { QueryResult, useQuery } from '@apollo/client';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { mockTechnicalManagementDropdownOptions } from '@/mocks/dropdownOptions';
import { mockBenjaminHallRecord } from '@/mocks/technicianManagementMocks';
import { withApolloAndFormProvider } from '@/mocks/testMocks';
import EditActionCell, {
  EditActionCellProps,
} from '@/modules/technician-management/components/edit-action-cell/EditActionCell';
import { useEditTechnicianRecordForm } from '@/modules/technician-management/components/technician-record-form/hooks';

jest.mock('@/modules/technician-management/components/technician-record-form/hooks');
jest.mock('@apollo/client');

describe('EditActionCell', () => {
  const mockOnEditTechnicianRecord = jest.fn();

  beforeEach(() => {
    (useEditTechnicianRecordForm as jest.Mock).mockReturnValue({
      onEditTechnicianRecord: mockOnEditTechnicianRecord,
      isUpdateRecordLoading: false,
    });

    (useQuery as jest.Mock).mockImplementation(() => {
      return {
        data: {
          getTechnicianRecordFormData: mockTechnicalManagementDropdownOptions,
        },
        loading: false,
      } as unknown as QueryResult;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const EditActionCellComponent = (props?: Partial<EditActionCellProps>) =>
    withApolloAndFormProvider(<EditActionCell technicianRecord={mockBenjaminHallRecord} {...props} />);

  it('should render component without crashing', () => {
    render(EditActionCellComponent());

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
  });

  it('should disable edit icon if technician record has Inactive employment status', () => {
    render(EditActionCellComponent({ technicianRecord: { ...mockBenjaminHallRecord, employmentStatus: 'Inactive' } }));

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should open Edit Elevator Record modal', async () => {
    render(EditActionCellComponent());

    const button = screen.getByRole('button');

    await userEvent.click(button);

    expect(screen.getByText('Benjamin Hall record')).toBeInTheDocument();
    expect(screen.getByTestId('edit-form-entity')).toBeInTheDocument();
  });

  it('should close Edit Elevator Record modal on Cancel button click', async () => {
    render(EditActionCellComponent());

    const button = screen.getByRole('button');

    await userEvent.click(button);

    const cancelButtonClick = screen.getByText('Cancel');

    await userEvent.click(cancelButtonClick);

    expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
    expect(screen.queryByText('Benjamin Hall record')).not.toBeInTheDocument();
    expect(screen.queryByTestId('edit-form-entity')).not.toBeInTheDocument();
  });

  it('should trigger onEditRepairJob handler on Edit button click', async () => {
    render(EditActionCellComponent());

    const button = screen.getByRole('button');

    await userEvent.click(button);

    const contactInfoField = screen.getByPlaceholderText(/Please provide a contact information/i) as HTMLInputElement;
    await userEvent.clear(contactInfoField);
    await userEvent.type(contactInfoField, 'test@google.com');

    const onEditButton = screen.getByText('Edit');

    await userEvent.click(onEditButton);

    await waitFor(() => {
      expect(mockOnEditTechnicianRecord).toHaveBeenCalled();
    });
  });
});
