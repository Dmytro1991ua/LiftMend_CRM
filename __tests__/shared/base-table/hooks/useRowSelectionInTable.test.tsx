import { ElevatorRecord } from '@prisma/client';
import { RowSelectionState } from '@tanstack/react-table';
import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';

import {
  mockGlassElevatorElevatorRecord,
  mockServiceElevatorElevatorRecord,
  mockWarehouseLiftElevatorRecord,
} from '@/mocks/elevatorManagementMocks';
import { UseRowSelectionInTable, UseRowSelectionProps } from '@/shared/base-table/hooks/types';
import useRowSelectionInTable from '@/shared/base-table/hooks/useRowSelectionInTable';

type TableStorageState = {
  filters?: {
    rowSelectionState?: RowSelectionState;
    selectedRows?: ElevatorRecord[];
  };
};

describe('useRowSelectionInTable', () => {
  const mockOnSetTableStorageState = jest.fn();
  const mockInitialRowSelectionState: RowSelectionState = { 0: true };
  const mockTableData = [
    mockGlassElevatorElevatorRecord,
    mockServiceElevatorElevatorRecord,
    mockWarehouseLiftElevatorRecord,
  ] as unknown as ElevatorRecord[];
  const mockBaseTableStorageState = {
    filters: {
      rowSelectionState: { ...mockInitialRowSelectionState },
      selectedRows: [mockTableData[0]],
    },
  };

  let currentState: TableStorageState;

  beforeEach(() => {
    currentState = {
      filters: {
        rowSelectionState: { ...mockInitialRowSelectionState },
        selectedRows: [mockTableData[0]],
      },
    };

    mockOnSetTableStorageState.mockImplementation((updater) => {
      currentState = typeof updater === 'function' ? updater(currentState) : updater;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    tableStorageState: mockBaseTableStorageState,
    tableData: mockTableData,
    onSetTableStorageState: mockOnSetTableStorageState,
  };

  const hook = (
    props?: Partial<UseRowSelectionProps<ElevatorRecord>>
  ): RenderHookResult<unknown, UseRowSelectionInTable> =>
    renderHook(() => useRowSelectionInTable({ ...defaultProps, ...props }));

  it('should return initial rowSelection state from tableStorageState', () => {
    const { result } = hook();

    expect(result.current.rowSelection).toEqual(mockInitialRowSelectionState);
  });

  it('should update rowSelection with direct value', () => {
    const { result } = hook();

    const newSelection: RowSelectionState = { 1: true, 2: true };

    act(() => {
      result.current.onRowSelectionChange(newSelection);
    });

    expect(mockOnSetTableStorageState).toHaveBeenCalled();
    expect(currentState.filters?.rowSelectionState).toEqual(newSelection);
    expect(currentState.filters?.selectedRows).toEqual([mockTableData[1], mockTableData[2]]);
  });

  it('should update rowSelection using updater function', () => {
    const { result } = hook();

    const updater = (prev: RowSelectionState) => ({
      ...prev,
      2: true,
    });

    act(() => {
      result.current.onRowSelectionChange(updater);
    });

    expect(currentState.filters?.rowSelectionState).toEqual({
      0: true,
      2: true,
    });

    expect(currentState.filters?.selectedRows).toEqual([mockTableData[0], mockTableData[2]]);
  });

  it('should ignore invalid row indexes when computing selectedRows', () => {
    const { result } = hook();

    const newSelection: RowSelectionState = {
      0: true,
      99: true, // this index is out of bounds
    };

    act(() => {
      result.current.onRowSelectionChange(newSelection);
    });

    expect(currentState.filters?.rowSelectionState).toEqual(newSelection);
    expect(currentState.filters?.selectedRows).toEqual([mockTableData[0]]);
  });

  it('should initialize selection when rowSelectionState is missing', () => {
    currentState = { filters: {} };

    mockOnSetTableStorageState.mockImplementation((updater) => {
      currentState = typeof updater === 'function' ? updater(currentState) : updater;
    });

    const { result } = hook({
      tableStorageState: currentState,
    });

    const newSelection: RowSelectionState = { 1: true };

    act(() => {
      result.current.onRowSelectionChange(newSelection);
    });

    expect(currentState.filters?.rowSelectionState).toEqual(newSelection);
    expect(currentState.filters?.selectedRows).toEqual([mockTableData[1]]);
  });
});
