import { Column, Row } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';

import { TestData, createMockColumn, createMockRow, createMockRowModel } from '@/mocks/tableMoks';
import TableActionBar from '@/shared/base-table/table-action-bar';
import { TableNames } from '@/shared/types';

jest.mock('@/shared/base-input/search-input', () => ({
  __esModule: true,
  default: ({ value }: { value: string }) => <div data-testid='search-input'>Search: {value}</div>,
}));

jest.mock('@/shared/base-table/table-filters', () => ({
  __esModule: true,
  default: () => <div data-testid='table-filters'>TableFilters</div>,
}));

jest.mock('@/shared/base-table/customize-columns', () => ({
  __esModule: true,
  default: () => <div data-testid='customize-columns'>CustomizeColumns</div>,
}));

jest.mock('@/shared/base-table/export-button', () => ({
  __esModule: true,
  default: () => <div data-testid='export-button'>ExportButton</div>,
}));

describe('TableActionBar', () => {
  const mockTestData: TestData = {
    name: 'Joe',
    email: 'test@gmail.com',
    age: 30,
  };
  const mockColumns = [
    createMockColumn('name', 'name', 'Name', true),
    createMockColumn('email', 'email', 'Email', true),
    createMockColumn('age', 'age', 'Age', true),
  ] as Column<TestData, unknown>[];
  const mockRow = createMockRow('name', mockTestData);
  const mockRowModel = createMockRowModel([mockRow as Row<TestData>]);
  const mockOnClearFilter = jest.fn();
  const mockOnFilterChange = jest.fn();
  const mockOnSearch = jest.fn();
  const mockOnClearSearch = jest.fn();

  const defaultProps = {
    searchTerm: '',
    storedFilters: {},
    filtersConfig: [],
    columns: mockColumns,
    rowModel: mockRowModel,
    tableName: TableNames.RepairJobsTable,
    isExportButtonDisabled: false,
    searchFieldPlaceholder: 'Search...',
    onClearSearch: mockOnClearSearch,
    onSearch: mockOnSearch,
    onFilterChange: mockOnFilterChange,
    onClearFilter: mockOnClearFilter,
  };
  it('should render component without crashing', () => {
    render(<TableActionBar {...defaultProps} />);

    expect(screen.getByTestId('table-action-bar')).toBeInTheDocument();
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('table-filters')).toBeInTheDocument();
    expect(screen.getByTestId('export-button')).toBeInTheDocument();
    expect(screen.getByTestId('customize-columns')).toBeInTheDocument();
  });
});
