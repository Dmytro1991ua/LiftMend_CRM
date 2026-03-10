import { render, screen } from '@testing-library/react';

import { mockEmploymentHistory } from '@/mocks/technicianManagementMocks';
import TechnicianEmploymentHistoryTable, {
  TechnicianEmploymentHistoryTableProps,
} from '@/modules/technician-management/components/technician-employment-history-table/TechnicianEmploymentHistoryTable';

describe('TechnicianEmploymentHistoryTable', () => {
  const mockDate = new Date('2026-02-22T12:00:00Z');

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(mockDate);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  const defaultProps = {
    employmentHistory: [mockEmploymentHistory],
  };

  const TechnicianEmploymentHistoryTableComponent = (props?: Partial<TechnicianEmploymentHistoryTableProps>) => (
    <TechnicianEmploymentHistoryTable {...defaultProps} {...props} />
  );

  it('should render component without crashing', () => {
    render(TechnicianEmploymentHistoryTableComponent());

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render correct column headers', async () => {
    render(TechnicianEmploymentHistoryTableComponent());

    const columnHeaders = screen.getAllByRole('columnheader');

    expect(columnHeaders).toHaveLength(4);

    expect(columnHeaders[0]).toHaveTextContent('Date');
    expect(columnHeaders[1]).toHaveTextContent('Availability Status');
    expect(columnHeaders[2]).toHaveTextContent('Employment Status');
    expect(columnHeaders[3]).toHaveTextContent('Reason');
  });

  it('should render correct table cells', async () => {
    render(TechnicianEmploymentHistoryTableComponent());

    const cells = screen.getAllByRole('cell');

    expect(cells).toHaveLength(4);

    expect(cells[0]).toHaveTextContent('Mar 09, 2026 12:11 PM');
    expect(cells[1]).toHaveTextContent('Available→Unavailable');
    expect(cells[2]).toHaveTextContent('Active→Inactive');
    expect(cells[3]).toHaveTextContent('Contract or Engagement Completed');
  });

  it('should show alert message when no data available for a table', () => {
    render(TechnicianEmploymentHistoryTableComponent({ employmentHistory: [] }));

    expect(screen.getByText('No technician employment history found.')).toBeInTheDocument();
  });
});
