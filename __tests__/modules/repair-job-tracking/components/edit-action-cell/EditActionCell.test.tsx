import { QueryResult, useQuery } from '@apollo/client';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { mockRepairJobTypes } from '@/mocks/dropdownOptions';
import { mockRepairJob } from '@/mocks/repairJobTrackingMocks';
import { withApolloAndFormProvider } from '@/mocks/testMocks';
import EditActionCell, {
  EditActionCellProps,
} from '@/modules/repair-job-tracking/components/edit-action-cell/EditActionCell';
import {
  EDIT_BUTTON_CANCELLED_STATUS_TOOLTIP_MESSAGE,
  EDIT_BUTTON_COMPLETED_STATUS_TOOLTIP_MESSAGE,
} from '@/shared/repair-job/constants';
import { useRepairJobFormHandler } from '@/shared/repair-job/hooks';

jest.mock('@/shared/repair-job/hooks/useRepairJobFormHandler');
jest.mock('@apollo/client');

describe('EditActionCell', () => {
  const mockOnEditRepairJob = jest.fn();

  beforeEach(() => {
    (useRepairJobFormHandler as jest.Mock).mockReturnValue({
      onEditRepairJob: mockOnEditRepairJob,
      isEditRepairJobLoading: false,
    });

    (useQuery as jest.Mock).mockImplementation(() => {
      return {
        data: {
          getRepairJobScheduleData: {
            repairJobTypes: [mockRepairJobTypes],
          },
        },
        loading: false,
      } as unknown as QueryResult;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const EditActionCellComponent = (props?: Partial<EditActionCellProps>) =>
    withApolloAndFormProvider(<EditActionCell repairJob={mockRepairJob} {...props} />);

  it('should render component without crashing', () => {
    render(EditActionCellComponent());

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
  });

  it('should disable edit button and show tooltip on hover when Repair Job is in Cancelled status', async () => {
    render(EditActionCellComponent({ repairJob: { ...mockRepairJob, status: 'Cancelled' } }));

    const button = screen.getByRole('button');

    expect(button).toBeDisabled;

    await userEvent.hover(button);

    const tooltipText = await screen.findByText(EDIT_BUTTON_CANCELLED_STATUS_TOOLTIP_MESSAGE);

    expect(tooltipText).toBeInTheDocument();
  });

  it('should disable edit button and show tooltip on hover when Repair Job is in Completed status', async () => {
    render(EditActionCellComponent({ repairJob: { ...mockRepairJob, status: 'Completed' } }));

    const button = screen.getByRole('button');

    expect(button).toBeDisabled;

    await userEvent.hover(button);

    const tooltipText = await screen.findByText(EDIT_BUTTON_COMPLETED_STATUS_TOOLTIP_MESSAGE);

    expect(tooltipText).toBeInTheDocument();
  });

  it('should open Edit Repair Job modal', async () => {
    render(EditActionCellComponent());

    const button = screen.getByRole('button');

    await userEvent.click(button);

    expect(screen.getByText('Edit Routine Repair Job')).toBeInTheDocument();
  });

  it('should close Edit Repair Job modal on Cancel button click', async () => {
    render(EditActionCellComponent());

    const button = screen.getByRole('button');

    await userEvent.click(button);

    const cancelButtonClick = screen.getByText('Cancel');

    await userEvent.click(cancelButtonClick);

    expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
    expect(screen.queryByText('Edit Routine Repair Job')).not.toBeInTheDocument();
  });

  it('should trigger onEditRepairJob handler on Edit button click', async () => {
    render(EditActionCellComponent());

    const button = screen.getByRole('button');

    await userEvent.click(button);

    const jobDescriptionField = screen.getByPlaceholderText(/Please provide a job description/i) as HTMLInputElement;
    await userEvent.clear(jobDescriptionField);
    await userEvent.type(jobDescriptionField, 'Update Repair Job Description');

    const okButton = screen.getByText('Edit');

    await userEvent.click(okButton);

    await waitFor(() => {
      expect(mockOnEditRepairJob).toHaveBeenCalled();
    });
  });
});
