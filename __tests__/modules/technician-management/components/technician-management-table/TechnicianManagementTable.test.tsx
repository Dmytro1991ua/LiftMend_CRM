import * as apollo from '@apollo/client';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';

import { mockBenjaminHallRecord, mockOliviaLewisRecord } from '@/mocks/technicianManagementMocks';
import { withRouterAndApolloProvider } from '@/mocks/testMocks';
import TechnicianManagementTable from '@/modules/technician-management/components/technician-management-table';
import { DEFAULT_TECHNICIAN_RECORDS_TABLE_EMPTY_TABLE_MESSAGE } from '@/modules/technician-management/components/technician-management-table/constants';
import { DEFAULT_TOTAL_DOTS } from '@/shared/base-score-cell/constants';
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

    expect(columnHeaders).toHaveLength(12);

    expect(columnHeaders[0]).toHaveTextContent('');
    expect(columnHeaders[1]).toHaveTextContent('Full Name↑↓');
    expect(columnHeaders[2]).toHaveTextContent('Technician Id');
    expect(columnHeaders[3]).toHaveTextContent('Availability Status↑↓');
    expect(columnHeaders[4]).toHaveTextContent('Performance Score');
    expect(columnHeaders[5]).toHaveTextContent('Contact Information');
    expect(columnHeaders[6]).toHaveTextContent('Skills');
    expect(columnHeaders[7]).toHaveTextContent('Certificates');
    expect(columnHeaders[8]).toHaveTextContent('Employment Status↑↓');
    expect(columnHeaders[9]).toHaveTextContent('Edit');
    expect(columnHeaders[10]).toHaveTextContent('Delete');
    expect(columnHeaders[11]).toHaveTextContent('Technician Visibility↑↓');
  });

  it('should render correct table cells', async () => {
    render(TechnicianManagementTableComponent());

    const cells = screen.getAllByRole('cell');
    const editIcons = screen.getAllByTestId('edit-icon');
    const trashIcons = screen.getAllByTestId('trash-icon');
    const activeTechnicianIcons = screen.getAllByTestId('active-technician-icon');
    const performanceScoreCells = screen.getAllByTestId('performance-score-cell');
    const firstRowDots = within(performanceScoreCells[0]).getAllByTestId('score-dot');
    const secondRowDots = within(performanceScoreCells[1]).getAllByTestId('score-dot');

    expect(cells).toHaveLength(24);

    // === First Row ===
    expect(cells[0]).toBeInTheDocument(); // checkbox
    expect(cells[1]).toHaveTextContent('Benjamin Hall');
    expect(cells[2]).toHaveTextContent('test-technician-id-1');
    expect(cells[3]).toHaveTextContent('Available');
    expect(firstRowDots).toHaveLength(DEFAULT_TOTAL_DOTS);
    expect(cells[5]).toHaveTextContent('benjamin.hall@example.com');
    expect(cells[6]).toHaveTextContent('ElectricalMechanicalTroubleshooting');
    expect(cells[7]).toHaveTextContent('Certified Elevator TechnicianFirst Aid Certification');
    expect(cells[8]).toHaveTextContent('Active');
    expect(editIcons[0]).toBeInTheDocument();
    expect(trashIcons[0]).toBeInTheDocument();
    expect(activeTechnicianIcons[0]).toBeInTheDocument();

    // === Second Row ===
    expect(cells[12]).toBeInTheDocument();
    expect(cells[13]).toHaveTextContent('Olivia Lewis');
    expect(cells[14]).toHaveTextContent('test-technician-id-2');
    expect(cells[15]).toHaveTextContent('Available');
    expect(secondRowDots).toHaveLength(DEFAULT_TOTAL_DOTS);
    expect(cells[17]).toHaveTextContent('olivia.lewis@example.com');
    expect(cells[18]).toHaveTextContent('Blueprint ReadingInstallationEmergency Response');
    expect(cells[19]).toHaveTextContent('Confined Space Entry CertificationFall Protection Certification');
    expect(cells[20]).toHaveTextContent('Active');
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
