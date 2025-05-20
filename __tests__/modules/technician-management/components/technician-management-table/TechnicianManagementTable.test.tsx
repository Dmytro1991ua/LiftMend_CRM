import * as apollo from '@apollo/client';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';

import { mockBenjaminHallRecord, mockOliviaLewisRecord } from '@/mocks/technicianManagementMocks';
import { withRouterAndApolloProvider } from '@/mocks/testMocks';
import TechnicianManagementTable from '@/modules/technician-management/components/technician-management-table';
import { DEFAULT_TECHNICIAN_RECORDS_TABLE_EMPTY_TABLE_MESSAGE } from '@/modules/technician-management/components/technician-management-table/constants';
import { AppRoutes } from '@/types/enums';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('TechnicianManagementTable', () => {
  beforeEach(() => {
    jest.spyOn(apollo, 'useQuery').mockImplementation(() => {
      return {
        data: {
          getTechnicianRecords: {
            edges: [{ node: mockBenjaminHallRecord }, { node: mockOliviaLewisRecord }],
          },
        },
      } as apollo.QueryResult;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const TechnicianManagementTableComponent = () =>
    withRouterAndApolloProvider(<TechnicianManagementTable />, AppRoutes.TechnicianManagement);

  it('should render component without crashing', () => {
    render(TechnicianManagementTableComponent());

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('Export to CSV')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search by Technician ID')).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render correct column headers', async () => {
    render(TechnicianManagementTableComponent());

    const columnHeaders = screen.getAllByRole('columnheader');

    expect(columnHeaders).toHaveLength(11);

    expect(columnHeaders[0]).toHaveTextContent('');
    expect(columnHeaders[1]).toHaveTextContent('Full Name↑↓');
    expect(columnHeaders[2]).toHaveTextContent('Technician Id');
    expect(columnHeaders[3]).toHaveTextContent('Availability Status↑↓');
    expect(columnHeaders[4]).toHaveTextContent('Contact Information');
    expect(columnHeaders[5]).toHaveTextContent('Skills');
    expect(columnHeaders[6]).toHaveTextContent('Certificates');
    expect(columnHeaders[7]).toHaveTextContent('Employment Status↑↓');
    expect(columnHeaders[8]).toHaveTextContent('Edit');
    expect(columnHeaders[9]).toHaveTextContent('Delete');
    expect(columnHeaders[10]).toHaveTextContent('Technician Visibility↑↓');
  });

  it('should render correct table cells', async () => {
    render(TechnicianManagementTableComponent());

    const cells = screen.getAllByRole('cell');
    const editIcons = screen.getAllByTestId('edit-icon');
    const trashIcons = screen.getAllByTestId('trash-icon');
    const activeTechnicianIcons = screen.getAllByTestId('active-technician-icon');

    expect(cells).toHaveLength(22);

    // === First Row ===
    expect(cells[0]).toBeInTheDocument(); // checkbox
    expect(cells[1]).toHaveTextContent('Benjamin Hall');
    expect(cells[2]).toHaveTextContent('test-technician-id-1');
    expect(cells[3]).toHaveTextContent('Available');
    expect(cells[4]).toHaveTextContent('benjamin.hall@example.com');
    expect(cells[5]).toHaveTextContent('ElectricalMechanicalTroubleshooting');
    expect(cells[6]).toHaveTextContent('Certified Elevator TechnicianFirst Aid Certification');
    expect(cells[7]).toHaveTextContent('Active');
    expect(editIcons[0]).toBeInTheDocument();
    expect(trashIcons[0]).toBeInTheDocument();
    expect(activeTechnicianIcons[0]).toBeInTheDocument();

    // === Second Row ===
    expect(cells[11]).toBeInTheDocument();
    expect(cells[12]).toHaveTextContent('Olivia Lewis');
    expect(cells[13]).toHaveTextContent('test-technician-id-2');
    expect(cells[14]).toHaveTextContent('Available');
    expect(cells[15]).toHaveTextContent('olivia.lewis@example.com');
    expect(cells[16]).toHaveTextContent('Blueprint ReadingInstallationEmergency Response');
    expect(cells[17]).toHaveTextContent('Confined Space Entry CertificationFall Protection Certification');
    expect(cells[18]).toHaveTextContent('Active');
    expect(editIcons[1]).toBeInTheDocument();
    expect(trashIcons[1]).toBeInTheDocument();
    expect(activeTechnicianIcons[1]).toBeInTheDocument();
  });

  it('should show alert message when no data available for a table', () => {
    jest.spyOn(apollo, 'useQuery').mockImplementation(() => {
      return {
        data: {
          getTechnicianRecords: {
            edges: [],
          },
        },
        loading: false,
        error: undefined,
      } as apollo.QueryResult;
    });

    render(TechnicianManagementTableComponent());

    expect(screen.getByText(DEFAULT_TECHNICIAN_RECORDS_TABLE_EMPTY_TABLE_MESSAGE)).toBeInTheDocument();
  });

  it('should trigger a row click and redirect to details page by elevator record id', async () => {
    const mockPush = jest.fn();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    render(TechnicianManagementTableComponent());

    const row = screen.getByRole('row', { name: /benjamin hall/i });

    expect(row).toBeInTheDocument();

    await userEvent.click(row);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith(`${AppRoutes.TechnicianManagement}/${mockBenjaminHallRecord.id}`);
  });
});
