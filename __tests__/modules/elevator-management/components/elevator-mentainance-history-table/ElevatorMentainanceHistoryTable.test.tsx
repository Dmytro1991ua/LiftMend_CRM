import * as apollo from '@apollo/client';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';

import { mockElevatorRecord } from '@/mocks/elevatorManagementMocks';
import { mockPassengerElevatorRepairJob } from '@/mocks/repairJobTrackingMocks';
import { withRouterAndApolloProvider } from '@/mocks/testMocks';
import { ElevatorMentainanceHistoryTable } from '@/modules/elevator-management/components/elevator-mentainance-history-table';
import { AppRoutes } from '@/types/enums';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('ElevatorMentainanceHistoryTable', () => {
  beforeEach(() => {
    jest.spyOn(apollo, 'useQuery').mockImplementation(() => {
      return {
        data: {
          getElevatorMentainanceHistory: {
            edges: [mockPassengerElevatorRepairJob],
          },
        },
      } as apollo.QueryResult;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const ElevatorMentainanceHistoryTableComponent = () =>
    withRouterAndApolloProvider(
      <ElevatorMentainanceHistoryTable elevatorRecord={mockElevatorRecord} />,
      AppRoutes.RepairJobDetails
    );

  it('should render component without crashing', () => {
    render(ElevatorMentainanceHistoryTableComponent());

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render correct column headers', async () => {
    render(ElevatorMentainanceHistoryTableComponent());

    const columnHeaders = screen.getAllByRole('columnheader');

    expect(columnHeaders).toHaveLength(6);

    expect(columnHeaders[0]).toHaveTextContent('Job Type');
    expect(columnHeaders[1]).toHaveTextContent('Status');
    expect(columnHeaders[2]).toHaveTextContent('Start Date');
    expect(columnHeaders[3]).toHaveTextContent('Planned End Date');
    expect(columnHeaders[4]).toHaveTextContent('Actual End Date');
    expect(columnHeaders[5]).toHaveTextContent('Technician Name');
  });

  it('should render correct table cells', async () => {
    render(ElevatorMentainanceHistoryTableComponent());

    const cells = screen.getAllByRole('cell');

    expect(cells).toHaveLength(6);

    expect(cells[0]).toHaveTextContent('Routine');
    expect(cells[1]).toHaveTextContent('Scheduled');
    expect(cells[2]).toHaveTextContent('Jan 19, 2025 00:00 AM');
    expect(cells[3]).toHaveTextContent('Jan 20, 2025 23:59 PM');
    expect(cells[4]).toHaveTextContent('Jan 19, 2025 13:17 PM');
    expect(cells[5]).toHaveTextContent('Sophia Martinez');
  });

  it('should show alert message when no data available for a table', () => {
    jest.spyOn(apollo, 'useQuery').mockImplementation(() => {
      return {
        data: {
          getElevatorMentainanceHistory: [],
        },
        loading: false,
        error: undefined,
      } as apollo.QueryResult;
    });

    render(ElevatorMentainanceHistoryTableComponent());

    expect(screen.getByText('No elevator maintenance history found.')).toBeInTheDocument();
  });

  it('should trigger a row click and redirect to details page by elevator record id', async () => {
    const mockPush = jest.fn();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    render(ElevatorMentainanceHistoryTableComponent());

    const row = screen.getByRole('row', { name: /Routine/i });

    expect(row).toBeInTheDocument();

    await userEvent.click(row);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith(`${AppRoutes.RepairJobTracking}/${mockPassengerElevatorRepairJob.node.id}`);
  });
});
