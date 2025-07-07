import { ColumnSizingState } from '@tanstack/react-table';
import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';

import { BaseHookProps, UseColumnResizing } from '@/shared/base-table/hooks/types';
import useColumnResizing from '@/shared/base-table/hooks/useColumnResizing';
import { ElevatorRecord } from '@/shared/types';

type TableStorageState = {
  filters: {
    columnResizingState?: ColumnSizingState;
    [key: string]: unknown;
  };
};

describe('useColumnResizing', () => {
  const mockOnSetTableStorageState = jest.fn();
  const mockInitialColumnResizingState = { col1: 100, col2: 200 };
  const mockBaseTableStorageState = {
    filters: {
      columnResizingState: mockInitialColumnResizingState,
    },
  };

  let currentState: TableStorageState;

  beforeEach(() => {
    currentState = {
      filters: {
        columnResizingState: { ...mockInitialColumnResizingState },
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
    onSetTableStorageState: mockOnSetTableStorageState,
  };

  const hook = (props?: Partial<BaseHookProps<ElevatorRecord>>): RenderHookResult<unknown, UseColumnResizing> =>
    renderHook(() => useColumnResizing({ ...defaultProps, ...props }));

  it('should return initial columnResizing state from tableStorageState', () => {
    const { result } = hook();

    expect(result.current.columnResizing).toEqual(mockInitialColumnResizingState);
  });

  it('should trigger onColumnResizing and update state with direct value', () => {
    const { result } = hook();

    const mockNewState = { col1: 120, col2: 220 };

    act(() => {
      result.current.onColumnResizing(mockNewState);
    });

    expect(mockOnSetTableStorageState).toHaveBeenCalled();

    expect(currentState.filters.columnResizingState).toEqual(mockNewState);
  });

  it('should trigger onColumnResizing and update state with updater function', () => {
    const { result } = hook();

    const updater = (prev: ColumnSizingState): ColumnSizingState => ({
      ...prev,
      col1: 300,
    });

    act(() => {
      result.current.onColumnResizing(updater);
    });

    expect(mockOnSetTableStorageState).toHaveBeenCalled();

    expect(currentState.filters.columnResizingState).toEqual({
      col1: 300,
      col2: 200,
    });
  });

  it('should set columnResizing state when it did not exist before', () => {
    let currentState: TableStorageState = {
      filters: {},
    };

    mockOnSetTableStorageState.mockImplementation((updater) => {
      currentState = typeof updater === 'function' ? updater(currentState) : updater;
    });

    const { result } = hook({
      tableStorageState: currentState,
    });

    const newState = { col3: 150 };

    act(() => {
      result.current.onColumnResizing(newState);
    });

    expect(currentState.filters.columnResizingState).toEqual(newState);
  });
});
