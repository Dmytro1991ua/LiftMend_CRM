import { render, screen } from '@testing-library/react';

import { mockRows } from '@/mocks/baseTableMocks';
import BaseTableBody from '@/shared/base-table/base-table-body';
import { DEFAULT_EMPTY_TABLE_MESSAGE } from '@/shared/base-table/types';

describe('BaseTableBody', () => {
  const mockDefaultProps = {
    tableRows: mockRows,
    columnLength: 2,
    emptyTableMessage: '',
    loading: false,
    errorMessage: '',
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
});
