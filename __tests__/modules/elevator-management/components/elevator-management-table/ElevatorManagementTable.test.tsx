import * as apollo from '@apollo/client';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';

import { mockGlassElevatorElevatorRecord, mockServiceElevatorElevatorRecord } from '@/mocks/elevatorManagementMocks';
import { withRouterAndApolloProvider } from '@/mocks/testMocks';
import ElevatorManagementTable from '@/modules/elevator-management/components/elevator-management-table';
import { DEFAULT_TOTAL_DOTS } from '@/shared/base-score-cell/constants';
import { AppRoutes } from '@/types/enums';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('ElevatorManagementTable', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const ElevatorManagementTableComponent = () =>
    withRouterAndApolloProvider(<ElevatorManagementTable />, AppRoutes.ElevatorManagement);

  it('should render component without crashing', () => {
    render(ElevatorManagementTableComponent());

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('Export to CSV')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search by Record ID')).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render correct column headers', async () => {
    render(ElevatorManagementTableComponent());

    const columnHeaders = screen.getAllByRole('columnheader');

    expect(columnHeaders).toHaveLength(15);

    expect(columnHeaders[0]).toHaveTextContent('');
    expect(columnHeaders[1]).toHaveTextContent('Elevator Type');
    expect(columnHeaders[2]).toHaveTextContent('Building Name');
    expect(columnHeaders[3]).toHaveTextContent('Elevator Location');
    expect(columnHeaders[4]).toHaveTextContent('Record Id');
    expect(columnHeaders[5]).toHaveTextContent('Status');
    expect(columnHeaders[6]).toHaveTextContent('Health Score');
    expect(columnHeaders[7]).toHaveTextContent('Capacity (kg)');
    expect(columnHeaders[8]).toHaveTextContent('Last Maintenance Date');
    expect(columnHeaders[9]).toHaveTextContent('Next Maintenance Date');
    expect(columnHeaders[10]).toHaveTextContent('Last Inspection Date');
    expect(columnHeaders[11]).toHaveTextContent('Next Inspection Date');
    expect(columnHeaders[12]).toHaveTextContent('Edit');
    expect(columnHeaders[13]).toHaveTextContent('Delete');
    expect(columnHeaders[14]).toHaveTextContent('Elevator Visibility');
  });

  it('should render correct table cells', async () => {
    jest.spyOn(apollo, 'useQuery').mockImplementation(() => {
      return {
        data: {
          getElevatorRecords: {
            edges: [mockGlassElevatorElevatorRecord, mockServiceElevatorElevatorRecord],
          },
        },
      } as apollo.QueryResult;
    });

    render(ElevatorManagementTableComponent());

    const cells = screen.getAllByRole('cell');
    const editIcons = screen.getAllByTestId('edit-icon');
    const healthScoreCells = screen.getAllByTestId('health-score-cell');
    const firstRowDots = within(healthScoreCells[0]).getAllByTestId('score-dot');
    const secondRowDots = within(healthScoreCells[1]).getAllByTestId('score-dot');

    expect(cells).toHaveLength(30);

    // === First Row ===
    expect(cells[0]).toBeInTheDocument(); // checkbox
    expect(cells[1]).toHaveTextContent('Glass Elevator');
    expect(cells[2]).toHaveTextContent('Silverhill Apartments');
    expect(cells[3]).toHaveTextContent('Penthouse');
    expect(cells[4]).toHaveTextContent('test-id-1');
    expect(cells[5]).toHaveTextContent('Operational');
    expect(firstRowDots).toHaveLength(DEFAULT_TOTAL_DOTS);
    expect(cells[7]).toHaveTextContent('2000');
    expect(cells[8]).toHaveTextContent('Jan 20, 2024 12:00 PM');
    expect(cells[9]).toHaveTextContent('Mar 10, 2024 15:00 PM');
    expect(cells[10]).toHaveTextContent('Feb 21, 2024 12:00 PM');
    expect(cells[11]).toHaveTextContent('Jun 20, 2024 19:00 PM');
    expect(editIcons[0]).toBeInTheDocument(); // First row edit icon
    expect(cells[13]).toBeInTheDocument();
    expect(cells[14]).toBeInTheDocument();

    // === Second Row ===
    expect(cells[15]).toBeInTheDocument();
    expect(cells[16]).toHaveTextContent('Service Elevator');
    expect(cells[17]).toHaveTextContent('Oceanview Condos');
    expect(cells[18]).toHaveTextContent('Sky Bridge');
    expect(cells[19]).toHaveTextContent('test-id-2');
    expect(cells[20]).toHaveTextContent('Operational');
    expect(secondRowDots).toHaveLength(DEFAULT_TOTAL_DOTS);
    expect(cells[22]).toHaveTextContent('3500');
    expect(cells[23]).toHaveTextContent('Apr 05, 2024 13:00 PM');
    expect(cells[24]).toHaveTextContent('Jul 28, 2024 18:00 PM');
    expect(cells[25]).toHaveTextContent('May 21, 2024 13:00 PM');
    expect(cells[26]).toHaveTextContent('Sep 20, 2024 19:00 PM');
    expect(editIcons[1]).toBeInTheDocument();
    expect(cells[28]).toBeInTheDocument();
    expect(cells[29]).toBeInTheDocument();
  });

  it('should show alert message when no data available for a table', () => {
    jest.spyOn(apollo, 'useQuery').mockImplementation(() => {
      return {
        data: {
          getElevatorRecords: {
            edges: [],
          },
        },
        loading: false,
        error: undefined,
      } as apollo.QueryResult;
    });

    render(ElevatorManagementTableComponent());

    expect(
      screen.getByText(
        'No data available. Please create a new elevator record in the table to keep track of it or apply different filter.'
      )
    ).toBeInTheDocument();
  });

  it('should trigger a row click and redirect to details page by elevator record id', async () => {
    const mockPush = jest.fn();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    jest.spyOn(apollo, 'useQuery').mockImplementation(() => {
      return {
        data: {
          getElevatorRecords: {
            edges: [mockGlassElevatorElevatorRecord, mockServiceElevatorElevatorRecord],
          },
        },
        loading: false,
        error: undefined,
      } as apollo.QueryResult;
    });

    render(ElevatorManagementTableComponent());

    const row = screen.getByRole('row', { name: /glass elevator/i });

    expect(row).toBeInTheDocument();

    await userEvent.click(row);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith(`${AppRoutes.ElevatorManagement}/${mockGlassElevatorElevatorRecord.node.id}`);
  });
});
