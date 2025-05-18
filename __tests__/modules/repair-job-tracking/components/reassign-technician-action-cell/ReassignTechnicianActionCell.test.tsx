import { QueryResult, useQuery } from '@apollo/client';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { mockAvailableTechnicians, mockRepairJob, mockWarningAlertMessage } from '@/mocks/repairJobTrackingMocks';
import { withApolloAndFormProvider } from '@/mocks/testMocks';
import {
  REASSIGN_TECHNICIAN_BUTTON_TOOLTIP_MESSAGE,
  TECHNICIAN_NAME_FIELD_TOOLTIP_MESSAGE,
} from '@/modules/repair-job-tracking/components/reassign-technician-action-cell/constants';
import ReassignTechnicianActionCell, {
  ReassignTechnicianActionCellProps,
} from '@/modules/repair-job-tracking/components/reassign-technician-action-cell/ReassignTechnicianActionCell';
import { useReassignTechnicianFormHandler } from '@/shared/repair-job/hooks/useReassignTechnicianFormHandler';

jest.mock('@apollo/client');
jest.mock('@/shared/repair-job/hooks/useReassignTechnicianFormHandler');

describe('ReassignTechnicianActionCell', () => {
  const mockOnHandleTechnicianReassignment = jest.fn();

  beforeEach(() => {
    (useReassignTechnicianFormHandler as jest.Mock).mockReturnValue({
      onHandleTechnicianReassignment: mockOnHandleTechnicianReassignment,
      isReassignTechnicianLoading: false,
    });

    (useQuery as jest.Mock).mockImplementation(() => {
      return {
        data: {
          getAvailableTechniciansForAssignment: mockAvailableTechnicians,
        },
        loading: false,
      } as unknown as QueryResult;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const ReassignTechnicianActionCellComponent = (props?: Partial<ReassignTechnicianActionCellProps>) =>
    withApolloAndFormProvider(<ReassignTechnicianActionCell repairJob={mockRepairJob} {...props} />);

  it('should render component without crashing', () => {
    render(ReassignTechnicianActionCellComponent());

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('technician-reassignment-icon')).toBeInTheDocument();
  });

  it('should disable technician reassignment button and show tooltip on hover when Repair Job is in Cancelled status', async () => {
    render(ReassignTechnicianActionCellComponent({ repairJob: { ...mockRepairJob, status: 'Cancelled' } }));

    const button = screen.getByRole('button');

    expect(button).toBeDisabled;

    await userEvent.hover(button);

    const tooltipText = await screen.findByText(REASSIGN_TECHNICIAN_BUTTON_TOOLTIP_MESSAGE);

    expect(tooltipText).toBeInTheDocument();
  });

  it('should disable technician reassignment button and show tooltip on hover when Repair Job is in Completed status', async () => {
    render(ReassignTechnicianActionCellComponent({ repairJob: { ...mockRepairJob, status: 'Completed' } }));

    const button = screen.getByRole('button');

    expect(button).toBeDisabled;

    await userEvent.hover(button);

    const tooltipText = await screen.findByText(REASSIGN_TECHNICIAN_BUTTON_TOOLTIP_MESSAGE);

    expect(tooltipText).toBeInTheDocument();
  });

  it('should open Reassign Technician modal', async () => {
    render(ReassignTechnicianActionCellComponent());

    const button = screen.getByRole('button');

    await userEvent.click(button);

    expect(screen.getByText('Reassign Technician')).toBeInTheDocument();
    expect(screen.getByText(mockWarningAlertMessage)).toBeInTheDocument();
  });

  it('should close Edit Repair Job modal on Cancel button click', async () => {
    render(ReassignTechnicianActionCellComponent());

    const button = screen.getByRole('button');

    await userEvent.click(button);

    const cancelButtonClick = screen.getByText('Cancel');

    await userEvent.click(cancelButtonClick);

    expect(screen.getByTestId('technician-reassignment-icon')).toBeInTheDocument();
    expect(screen.queryByText('Reassign Technician')).not.toBeInTheDocument();
    expect(screen.queryByText(mockWarningAlertMessage)).not.toBeInTheDocument();
  });

  it('should show tooltip message on info icon hover', async () => {
    render(ReassignTechnicianActionCellComponent());

    const button = screen.getByRole('button');

    await userEvent.click(button);

    const infoIcon = screen.getByTestId('info-icon');

    await userEvent.hover(infoIcon);

    const tooltipText = await screen.findByText(TECHNICIAN_NAME_FIELD_TOOLTIP_MESSAGE);

    expect(tooltipText).toBeInTheDocument();
  });

  it('should select technician from dropdown, trigger onHandleTechnicianReassignment handler on Edit button click', async () => {
    render(ReassignTechnicianActionCellComponent());

    const button = screen.getByRole('button');

    await userEvent.click(button);

    const jobDescriptionField = screen.getByRole('combobox');
    await userEvent.click(jobDescriptionField);

    const dropdownOption = screen.getByText('Benjamin Hall');
    expect(dropdownOption).toBeInTheDocument();

    await userEvent.click(dropdownOption);

    const okButton = screen.getByText('Edit');
    expect(okButton).toBeEnabled();

    await userEvent.click(okButton);

    await waitFor(() => {
      expect(mockOnHandleTechnicianReassignment).toHaveBeenCalled();
    });
  });
});
