import { Column, Header, HeaderContext, HeaderGroup, Row, RowModel } from '@tanstack/react-table';

export type TestData = { name: string; age: number; email: string; edit?: string; delete?: string };

export const mockHeaderGroup = (id: string, headers: Partial<Header<TestData, unknown>>[]): HeaderGroup<TestData> => ({
  id,
  depth: 0,
  headers: headers as Header<TestData, unknown>[],
});

export const createMockHeader = (
  id: string,
  label: string,
  canSort = false,
  isSorted: false | 'asc' | 'desc' = false,
  width = 100
): Partial<Header<TestData, unknown>> => ({
  id,
  colSpan: 1,
  isPlaceholder: false,
  column: {
    columnDef: { header: () => label },
    getCanSort: () => canSort,
    getIsSorted: () => isSorted,
    getToggleSortingHandler: () => jest.fn(),
    getSize: () => width,
    getCanResize: () => true,
    getIsResizing: () => true,
  } as unknown as Column<TestData, unknown>,
  getContext: () => ({} as HeaderContext<TestData, unknown>),
  getResizeHandler: () => jest.fn(),
});

export const createMockColumn = (
  id: string,
  accessorKey: keyof TestData,
  headerLabel: string,
  isVisible = true,
  canHide = true
): Partial<Column<TestData, unknown>> => ({
  id,
  columnDef: {
    accessorKey,
    header: () => headerLabel,
  },
  getSize: () => 120,
  getCanSort: () => true,
  getIsSorted: () => false,
  getToggleSortingHandler: () => jest.fn(),
  accessorFn: (row: TestData) => row[accessorKey],
  getCanHide: () => canHide,
  getIsVisible: () => isVisible,
});

export const createMockRowModel = (rows: Row<TestData>[]): RowModel<TestData> => ({
  rows,
  flatRows: rows,
  rowsById: Object.fromEntries(rows.map((row) => [row.id, row])),
});

export const createMockRow = (id: string, values: TestData, isSelected = false): Partial<Row<TestData>> => ({
  id,
  original: values,
  getValue: <TValue>(columnId: string): TValue => {
    return values[columnId as keyof TestData] as TValue;
  },
  getVisibleCells: () => {
    return Object.keys(values).map((key) => ({
      column: {
        columnDef: {
          accessorKey: key,
        },
      },
      getValue: () => values[key as keyof TestData],
    })) as unknown as ReturnType<Row<TestData>['getVisibleCells']>;
  },
  getIsSelected: () => isSelected,
});
