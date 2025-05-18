import * as apollo from '@apollo/client';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';

import { mockMastLiftRepairJob, mockPassengerElevatorRepairJob } from '@/mocks/repairJobTrackingMocks';
import { withRouterAndApolloProvider } from '@/mocks/testMocks';
import RepairJobTable from '@/modules/repair-job-tracking/components/repair-job-table';
import { DEFAULT_REPAIR_JOBS_TABLE_EMPTY_TABLE_MESSAGE } from '@/modules/repair-job-tracking/components/repair-job-table/constants';
import { AppRoutes } from '@/types/enums';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('RepairJobTable', () => {
  beforeEach(() => {
    jest.spyOn(apollo, 'useQuery').mockImplementation(() => {
      return {
        data: {
          getRepairJobs: {
            edges: [mockPassengerElevatorRepairJob, mockMastLiftRepairJob],
          },
        },
      } as apollo.QueryResult;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const RepairJobTableComponent = () => withRouterAndApolloProvider(<RepairJobTable />, AppRoutes.RepairJobTracking);

  it('should render component without crashing', () => {
    render(RepairJobTableComponent());

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('Export to CSV')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search by Repair Job ID')).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render correct column headers', async () => {
    render(RepairJobTableComponent());

    const columnHeaders = screen.getAllByRole('columnheader');

    expect(columnHeaders).toHaveLength(17);

    expect(columnHeaders[0]).toHaveTextContent('');
    expect(columnHeaders[1]).toHaveTextContent('Job Type↑↓');
    expect(columnHeaders[2]).toHaveTextContent('Job Id');
    expect(columnHeaders[3]).toHaveTextContent('Job Details');
    expect(columnHeaders[4]).toHaveTextContent('Priority↑↓');
    expect(columnHeaders[5]).toHaveTextContent('Status');
    expect(columnHeaders[6]).toHaveTextContent('Start Date↑↓');
    expect(columnHeaders[7]).toHaveTextContent('Planned End Date↑↓');
    expect(columnHeaders[8]).toHaveTextContent('Actual End Date↑↓');
    expect(columnHeaders[9]).toHaveTextContent('Is Overdue?↑↓');
    expect(columnHeaders[10]).toHaveTextContent('Elevator Type↑↓');
    expect(columnHeaders[11]).toHaveTextContent('Building Name↑↓');
    expect(columnHeaders[12]).toHaveTextContent('Elevator Location↑↓');
    expect(columnHeaders[13]).toHaveTextContent('Technician Name↑↓');
    expect(columnHeaders[14]).toHaveTextContent('Reassign Technician');
    expect(columnHeaders[15]).toHaveTextContent('Edit');
    expect(columnHeaders[16]).toHaveTextContent('Delete');
  });

  it('should render correct table cells', async () => {
    render(RepairJobTableComponent());

    const cells = screen.getAllByRole('cell');
    const editIcons = screen.getAllByTestId('edit-icon');
    const checkIcons = screen.getAllByTestId('check-icon');
    const technicianReassignmentIcons = screen.getAllByTestId('technician-reassignment-icon');
    const trashIcons = screen.getAllByTestId('trash-icon');

    expect(cells).toHaveLength(34);

    // === First Row ===
    expect(cells[0]).toBeInTheDocument(); // checkbox
    expect(cells[1]).toHaveTextContent('Routine');
    expect(cells[2]).toHaveTextContent('1bcc2a00-5296-475f-af08-5cada100d509');
    expect(cells[3]).toHaveTextContent('asdasdasdasd');
    expect(cells[4]).toHaveTextContent('Low');
    expect(cells[5]).toHaveTextContent('Scheduled');
    expect(cells[6]).toHaveTextContent('Jan 19, 2025 00:00 AM');
    expect(cells[7]).toHaveTextContent('Jan 20, 2025 23:59 PM');
    expect(cells[8]).toHaveTextContent('Jan 19, 2025 13:17 PM');
    expect(checkIcons[0]).toBeInTheDocument();
    expect(cells[10]).toHaveTextContent('Passenger Elevator');
    expect(cells[11]).toHaveTextContent('Crystal Ridge Towers');
    expect(cells[12]).toHaveTextContent('Lobby');
    expect(cells[13]).toHaveTextContent('Sophia Martinez');
    expect(technicianReassignmentIcons[0]).toBeInTheDocument();
    expect(editIcons[0]).toBeInTheDocument();
    expect(trashIcons[0]).toBeInTheDocument();

    // === Second Row ===
    expect(cells[17]).toBeInTheDocument();
    expect(cells[18]).toHaveTextContent('Upgrade');
    expect(cells[19]).toHaveTextContent('3eddc560-b0e8-473d-a712-9e1d96b2184f');
    expect(cells[20]).toHaveTextContent('asdasdasdasd');
    expect(cells[21]).toHaveTextContent('Medium');
    expect(cells[22]).toHaveTextContent('Completed');
    expect(cells[23]).toHaveTextContent('Jan 19, 2025 00:00 AM');
    expect(cells[24]).toHaveTextContent('Jan 20, 2025 23:59 PM');
    expect(cells[25]).toHaveTextContent('Jan 19, 2025 13:16 PM');
    expect(checkIcons[1]).toBeInTheDocument();
    expect(cells[27]).toHaveTextContent('Mast Lift');
    expect(cells[28]).toHaveTextContent('Cedar Ridge Apartments');
    expect(cells[29]).toHaveTextContent('Warehouse Level');
    expect(cells[30]).toHaveTextContent('Chloe Carter');
    expect(technicianReassignmentIcons[0]).toBeInTheDocument();
    expect(editIcons[0]).toBeInTheDocument();
    expect(trashIcons[0]).toBeInTheDocument();
  });

  it('should show alert message when no data available for a table', () => {
    jest.spyOn(apollo, 'useQuery').mockImplementation(() => {
      return {
        data: {
          getRepairJobs: {
            edges: [],
          },
        },
        loading: false,
        error: undefined,
      } as apollo.QueryResult;
    });

    render(RepairJobTableComponent());

    expect(screen.getByText(DEFAULT_REPAIR_JOBS_TABLE_EMPTY_TABLE_MESSAGE)).toBeInTheDocument();
  });

  it('should trigger a row click and redirect to details page by elevator record id', async () => {
    const mockPush = jest.fn();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    render(RepairJobTableComponent());

    const row = screen.getByRole('row', { name: /passenger elevator/i });

    expect(row).toBeInTheDocument();

    await userEvent.click(row);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith(`${AppRoutes.RepairJobTracking}/${mockPassengerElevatorRepairJob.node.id}`);
  });

  it('should highlight table row in green color when repair job is Completed', () => {
    jest.spyOn(apollo, 'useQuery').mockImplementation(() => {
      return {
        data: {
          getRepairJobs: {
            edges: [
              {
                ...mockPassengerElevatorRepairJob,
                node: { ...mockPassengerElevatorRepairJob.node, status: 'Completed' },
              },
            ],
          },
        },
      } as apollo.QueryResult;
    });

    render(RepairJobTableComponent());

    const row = screen.getByRole('row', { name: /passenger elevator/i });

    expect(row).toHaveClass('bg-green-50 hover:bg-green-50');
  });

  it('should highlight table row in yellow when repair job is Canceled', () => {
    jest.spyOn(apollo, 'useQuery').mockImplementation(() => {
      return {
        data: {
          getRepairJobs: {
            edges: [
              {
                ...mockPassengerElevatorRepairJob,
                node: { ...mockPassengerElevatorRepairJob.node, status: 'Cancelled' },
              },
            ],
          },
        },
      } as apollo.QueryResult;
    });

    render(RepairJobTableComponent());

    const row = screen.getByRole('row', { name: /passenger elevator/i });

    expect(row).toHaveClass('bg-red-50 hover:bg-red-50');
  });

  it('should highlight table row in yellow when repair job is Overdue', () => {
    jest.spyOn(apollo, 'useQuery').mockImplementation(() => {
      return {
        data: {
          getRepairJobs: {
            edges: [
              {
                ...mockPassengerElevatorRepairJob,
                node: { ...mockPassengerElevatorRepairJob.node, isOverdue: true },
              },
            ],
          },
        },
      } as apollo.QueryResult;
    });

    render(RepairJobTableComponent());

    const row = screen.getByRole('row', { name: /passenger elevator/i });

    expect(row).toHaveClass('bg-yellow-50 hover:bg-yellow-50');
  });
});
