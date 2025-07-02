import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { mockRows } from '@/mocks/baseTableMocks';
import BaseTableBody from '@/shared/base-table/base-table-body';
import { DEFAULT_EMPTY_TABLE_MESSAGE } from '@/shared/base-table/constants';

describe('BaseTableBody', () => {
  const mockOnRowClick = jest.fn();

  const mockDefaultProps = {
    tableRows: mockRows,
    columnLength: 2,
    emptyTableMessage: '',
    loading: false,
    errorMessage: '',
    onHandleRowClick: mockOnRowClick,
  };

  it('should render component without crashing', () => {
    render(<BaseTableBody {...mockDefaultProps} />);

    expect(screen.getByTestId('base-table-body')).toBeInTheDocument();
  });

  it('should render empty table message when no data provided', () => {
    render(<BaseTableBody {...mockDefaultProps} tableRows={[]} />);

    expect(screen.getByText(DEFAULT_EMPTY_TABLE_MESSAGE)).toBeInTheDocument();
  });

  it('should render error alert when no error occurred', () => {
    render(<BaseTableBody {...mockDefaultProps} errorMessage='Test Error Occurred' tableRows={[]} />);

    expect(screen.getByText('Test Error Occurred')).toBeInTheDocument();
    expect(screen.getByText('Test Error Occurred')).toBeInTheDocument();
  });

  it('should render loading spinner when table data is fetching', () => {
    render(<BaseTableBody {...mockDefaultProps} loading={true} tableRows={[]} />);

    expect(screen.getByTestId('hourglass-svg')).toBeInTheDocument();
  });

  it('should disabled table row if isRowDisabled is true', () => {
    render(<BaseTableBody {...mockDefaultProps} isRowDisabled={() => true} />);

    const tableRow = screen.getByTestId('base-table-row');

    expect(tableRow).toHaveClass('opacity-40 cursor-not-allowed');
  });

  it('should highlight table row', () => {
    const mockRowHighlightProps = {
      isHighlighted: true,
      highlightStyles: 'bg-yellow-50 hover:bg-yellow-50',
    };

    render(<BaseTableBody {...mockDefaultProps} getRowHighlightInfo={() => mockRowHighlightProps} />);

    const tableRow = screen.getByTestId('base-table-row');

    expect(tableRow).toHaveClass('bg-yellow-50 hover:bg-yellow-50');
  });

  it('should set title attribute when rowTooltipMessage is a string', () => {
    const message = 'Static tooltip message';

    render(<BaseTableBody {...mockDefaultProps} rowTooltipMessage={message} />);

    const tableRow = screen.getByTestId('base-table-row');

    expect(tableRow).toHaveAttribute('title', message);
  });

  it('should set title attribute when rowTooltipMessage is a function', () => {
    const message = 'Dynamic tooltip message';

    render(<BaseTableBody {...mockDefaultProps} rowTooltipMessage={() => message} />);

    const tableRow = screen.getByTestId('base-table-row');

    expect(tableRow).toHaveAttribute('title', message);
  });

  it('should handle a table row click', async () => {
    render(<BaseTableBody {...mockDefaultProps} isRowDisabled={() => false} />);

    const tableRow = screen.getByTestId('base-table-row');

    await userEvent.click(tableRow);

    expect(mockOnRowClick).toHaveBeenCalled();
  });
});
