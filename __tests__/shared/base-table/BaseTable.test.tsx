import React from 'react';

import { ColumnDef } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';

import BaseTable from '@/shared/base-table';
import { DEFAULT_EMPTY_TABLE_MESSAGE } from '@/shared/base-table/constants';

type MockData = {
  name: string;
  status: string;
};

const mockData: MockData[] = [
  {
    name: 'Row 1 Name',
    status: 'ON',
  },
  {
    name: 'Row 2 Name',
    status: 'OFF',
  },
];

const mockColumns: ColumnDef<MockData>[] = [
  {
    accessorKey: 'name',
    id: 'name',
    header: 'Column name',
  },
  {
    accessorKey: 'status',
    id: 'status',
    header: 'Status',
  },
];

const loadMoreMock = jest.fn();

describe('<BaseTable />', () => {
  it('should render loader on data loading', () => {
    render(
      <BaseTable<MockData>
        columns={mockColumns}
        data={[]}
        hasMore={false}
        loadMore={loadMoreMock}
        loading={true}
        tableStorageState={{}}
        onHandleRowClick={jest.fn()}
        onSetTableColumns={jest.fn()}
        onSetTableStorageState={jest.fn()}
      />
    );

    expect(screen.getByTestId('hourglass-svg')).toBeInTheDocument();
  });

  it('should render empty table message if there is no data', () => {
    render(
      <BaseTable<MockData>
        columns={mockColumns}
        data={[]}
        hasMore={false}
        loadMore={loadMoreMock}
        loading={false}
        tableStorageState={{}}
        onHandleRowClick={jest.fn()}
        onSetTableColumns={jest.fn()}
        onSetTableStorageState={jest.fn()}
      />
    );

    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    expect(screen.getByText(DEFAULT_EMPTY_TABLE_MESSAGE)).toBeInTheDocument();
  });

  it('should render provided header names', () => {
    render(
      <BaseTable<MockData>
        columns={mockColumns}
        data={mockData}
        hasMore={false}
        loadMore={loadMoreMock}
        loading={false}
        tableStorageState={{}}
        onHandleRowClick={jest.fn()}
        onSetTableColumns={jest.fn()}
        onSetTableStorageState={jest.fn()}
      />
    );

    const columnHeaders = screen.getAllByRole('columnheader');

    expect(columnHeaders).toHaveLength(mockColumns.length);
    expect(columnHeaders[0]).toHaveTextContent('Column name');
    expect(columnHeaders[1]).toHaveTextContent('Status');
  });

  it('should correctly render cell content', () => {
    render(
      <BaseTable<MockData>
        columns={mockColumns}
        data={mockData}
        hasMore={false}
        loadMore={loadMoreMock}
        loading={false}
        tableStorageState={{}}
        onHandleRowClick={jest.fn()}
        onSetTableColumns={jest.fn()}
        onSetTableStorageState={jest.fn()}
      />
    );

    const cells = screen.getAllByRole('cell');
    expect(cells).toHaveLength(mockData.length * mockColumns.length);

    // row 1
    expect(cells[0]).toHaveTextContent('Row 1 Name');
    expect(cells[1]).toHaveTextContent('ON');

    // row 2
    expect(cells[2]).toHaveTextContent('Row 2 Name');
    expect(cells[3]).toHaveTextContent('OFF');
  });
});
