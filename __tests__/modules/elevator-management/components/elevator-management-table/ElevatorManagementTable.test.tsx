import * as apollo from '@apollo/client';

import { withRouterAndApolloProvider } from '@/mocks/testMocks';
import ElevatorManagementTable from '@/modules/elevator-management/components/elevator-management-table';
import { AppRoutes } from '@/types/enums';
import { render, screen, waitFor } from '@testing-library/react';
import { mockGlassElevatorElevatorRecord, mockServiceElevatorElevatorRecord } from '@/mocks/elevatorManagementMocks';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';

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

    await waitFor(() => {
      expect(columnHeaders).toHaveLength(12);

      expect(columnHeaders[0]).toHaveTextContent('');
      expect(columnHeaders[1]).toHaveTextContent('Elevator Type');
      expect(columnHeaders[2]).toHaveTextContent('Building Name');
      expect(columnHeaders[3]).toHaveTextContent('Elevator Location');
      expect(columnHeaders[4]).toHaveTextContent('Record Id');
      expect(columnHeaders[5]).toHaveTextContent('Status');
      expect(columnHeaders[6]).toHaveTextContent('Capacity (kg)');
      expect(columnHeaders[7]).toHaveTextContent('Last Maintenance Date');
      expect(columnHeaders[8]).toHaveTextContent('Next Maintenance Date');
      expect(columnHeaders[9]).toHaveTextContent('Edit');
      expect(columnHeaders[10]).toHaveTextContent('Delete');
      expect(columnHeaders[11]).toHaveTextContent('Elevator Visibility');
    });
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

    await waitFor(() => {
      expect(cells).toHaveLength(24);

      // === First Row ===
      expect(cells[0]).toBeInTheDocument(); // checkbox
      expect(cells[1]).toHaveTextContent('Glass Elevator');
      expect(cells[2]).toHaveTextContent('Silverhill Apartments');
      expect(cells[3]).toHaveTextContent('Penthouse');
      expect(cells[4]).toHaveTextContent('test-id-1');
      expect(cells[5]).toHaveTextContent('Operational');
      expect(cells[6]).toHaveTextContent('2000');
      expect(cells[7]).toHaveTextContent('Jan 20, 2024 12:00 PM');
      expect(cells[8]).toHaveTextContent('Mar 10, 2024 15:00 PM');
      expect(cells[9].querySelector('[data-testid="edit-icon"]')).toBeInTheDocument();
      expect(cells[10]).toBeInTheDocument();
      expect(cells[11]).toBeInTheDocument();

      // === Second Row ===
      expect(cells[12]).toBeInTheDocument();
      expect(cells[13]).toHaveTextContent('Service Elevator');
      expect(cells[14]).toHaveTextContent('Oceanview Condos');
      expect(cells[15]).toHaveTextContent('Sky Bridge');
      expect(cells[16]).toHaveTextContent('test-id-2');
      expect(cells[17]).toHaveTextContent('Operational');
      expect(cells[18]).toHaveTextContent('3500');
      expect(cells[19]).toHaveTextContent('Apr 05, 2024 13:00 PM');
      expect(cells[20]).toHaveTextContent('Jul 28, 2024 18:00 PM');
      expect(cells[21].querySelector('[data-testid="edit-icon"]')).toBeInTheDocument();
      expect(cells[22]).toBeInTheDocument();
      expect(cells[23]).toBeInTheDocument();
    });
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

    const row = screen.getByText('Glass Elevator').closest('tr') as HTMLTableRowElement;

    expect(row).toBeInTheDocument();

    userEvent.click(row);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith(
        `${AppRoutes.ElevatorManagement}/${mockGlassElevatorElevatorRecord.node.id}`
      );
    });
  });
});
