import * as apollo from '@apollo/client';
import { render, screen } from '@testing-library/react';

import { mockRepairJob } from '@/mocks/repairJobScheduling';
import { withApolloProvider } from '@/mocks/testMocks';
import { RecentRepairJobsTable } from '@/modules/dashboard/components/recent-repair-jobs-table';

describe('RecentRepairJobsTable', () => {
  beforeEach(() => {
    jest.spyOn(apollo, 'useQuery').mockImplementation(() => {
      return {
        data: {
          getRecentRepairJobs: [{ ...mockRepairJob, status: 'Scheduled' }],
        },
      } as apollo.QueryResult;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const RecentRepairJobsTableComponent = () => withApolloProvider(<RecentRepairJobsTable />);

  it('should render component without crashing', () => {
    render(RecentRepairJobsTableComponent());

    expect(screen.getByText('Recent Repair Jobs')).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render correct column headers', async () => {
    render(RecentRepairJobsTableComponent());

    const columnHeaders = screen.getAllByRole('columnheader');

    expect(columnHeaders).toHaveLength(8);

    expect(columnHeaders[0]).toHaveTextContent('Job Id');
    expect(columnHeaders[1]).toHaveTextContent('Job Type');
    expect(columnHeaders[2]).toHaveTextContent('Job Details');
    expect(columnHeaders[3]).toHaveTextContent('Status');
    expect(columnHeaders[4]).toHaveTextContent('Elevator Type');
    expect(columnHeaders[5]).toHaveTextContent('Building Name');
    expect(columnHeaders[6]).toHaveTextContent('Elevator Location');
    expect(columnHeaders[7]).toHaveTextContent('Technician Name');
  });

  it('should render correct table cells', async () => {
    render(RecentRepairJobsTableComponent());

    const cells = screen.getAllByRole('cell');

    expect(cells).toHaveLength(8);

    expect(cells[0]).toHaveTextContent('7fdfd63f-d091-4fa6-8194-cc986e7e1848');
    expect(cells[1]).toHaveTextContent('Emergency');
    expect(cells[2]).toHaveTextContent('asdasdasdasd');
    expect(cells[3]).toHaveTextContent('Scheduled');
    expect(cells[4]).toHaveTextContent('Eco-Friendly Elevator');
    expect(cells[5]).toHaveTextContent('Bluewater Hotel');
    expect(cells[6]).toHaveTextContent('Restaurant');
    expect(cells[7]).toHaveTextContent('Chloe Carter');
  });

  it('should show alert message when no data available for a table', () => {
    jest.spyOn(apollo, 'useQuery').mockImplementation(() => {
      return {
        data: {
          getRecentRepairJobs: [],
        },
        loading: false,
        error: undefined,
      } as apollo.QueryResult;
    });

    render(RecentRepairJobsTableComponent());

    expect(screen.getByText('No recent repair jobs found.')).toBeInTheDocument();
  });
});
