import { render, screen } from '@testing-library/react';

import { mockElevatorDowntime } from '@/mocks/elevatorManagementMocks';
import ElevatorDowntimeHistoryTable from '@/modules/elevator-management/components/elevator-downtime-history-table';
import { ElevatorDowntimeHistoryTableProps } from '@/modules/elevator-management/components/elevator-downtime-history-table/ElevatorDowntimeHistoryTable';

describe('ElevatorDowntimeHistoryTable', () => {
  const mockDate = new Date('2026-02-25T12:00:00Z');

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(mockDate);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  const defaultProps = {
    elevatorDowntimeList: [{ ...mockElevatorDowntime, startedAt: new Date('2026-02-24T10:36:15.654Z') }],
  };

  const ElevatorDowntimeHistoryTableComponent = (props?: Partial<ElevatorDowntimeHistoryTableProps>) => (
    <ElevatorDowntimeHistoryTable {...defaultProps} {...props} />
  );

  it('should render component without crashing', () => {
    render(ElevatorDowntimeHistoryTableComponent());

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render correct column headers', async () => {
    render(ElevatorDowntimeHistoryTableComponent());

    const columnHeaders = screen.getAllByRole('columnheader');

    expect(columnHeaders).toHaveLength(3);

    expect(columnHeaders[0]).toHaveTextContent('Start Date');
    expect(columnHeaders[1]).toHaveTextContent('Duration');
    expect(columnHeaders[2]).toHaveTextContent('Reason');
  });

  it('should render correct table cells', async () => {
    render(ElevatorDowntimeHistoryTableComponent());

    const cells = screen.getAllByRole('cell');

    expect(cells).toHaveLength(3);

    expect(cells[0]).toHaveTextContent('Feb 24, 2026 12:36 PM');
    expect(cells[1]).toHaveTextContent('Ongoing (1d 1h 23m)');
    expect(cells[2]).toHaveTextContent('Safety Restriction');
  });

  it('should show alert message when no data available for a table', () => {
    render(ElevatorDowntimeHistoryTableComponent({ elevatorDowntimeList: [] }));

    expect(screen.getByText('No elevator downtime history found.')).toBeInTheDocument();
  });
});
