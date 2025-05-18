import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { mockRepairJob } from '@/mocks/repairJobTrackingMocks';
import { withApolloProvider } from '@/mocks/testMocks';
import DeleteActionCell from '@/modules/repair-job-tracking/components/delete-action-cell';
import { useRepairJobDeletion } from '@/shared/repair-job/hooks';

jest.mock('@/shared/repair-job/hooks');

describe('DeleteActionCell', () => {
  const mockOnDeleteRepairJob = jest.fn();

  beforeEach(() => {
    (useRepairJobDeletion as jest.Mock).mockReturnValue({
      isDeleteRepairJobLoading: false,
      onDeleteRepairJob: mockOnDeleteRepairJob,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const DeleteActionCellComponent = () => withApolloProvider(<DeleteActionCell repairJob={mockRepairJob} />);

  it('should render component without crashing', () => {
    render(DeleteActionCellComponent());

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('trash-icon')).toBeInTheDocument();
  });

  it('should open Delete Repair Job confirmation modal', async () => {
    render(DeleteActionCellComponent());

    const button = screen.getByRole('button');

    await userEvent.click(button);

    expect(screen.getByText('Delete Repair Job with associated Calendar event')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete Routine Repair Job ?')).toBeInTheDocument();
  });

  it('should close Delete Repair Job confirmation modal on Cancel button click', async () => {
    render(DeleteActionCellComponent());

    const button = screen.getByRole('button');

    await userEvent.click(button);

    const cancelButtonClick = screen.getByText('Cancel');

    await userEvent.click(cancelButtonClick);

    expect(screen.getByTestId('trash-icon')).toBeInTheDocument();
    expect(screen.queryByText('Delete Repair Job with associated Calendar event')).not.toBeInTheDocument();
    expect(screen.queryByText('Are you sure you want to delete Routine Repair Job ?')).not.toBeInTheDocument();
  });

  it('should trigger onDeleteRepairJob handler on Ok button click', async () => {
    render(DeleteActionCellComponent());

    const button = screen.getByRole('button');

    await userEvent.click(button);

    const okButton = screen.getByText('Ok');

    await userEvent.click(okButton);

    expect(mockOnDeleteRepairJob).toHaveBeenCalled();
  });
});
