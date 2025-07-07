import { VisibilityState } from '@tanstack/react-table';
import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';

import { BaseHookProps, UseColumnsVisibility } from '@/shared/base-table/hooks/types';
import useColumnsVisibility from '@/shared/base-table/hooks/useColumnsVisibility';
import { ElevatorRecord } from '@/shared/types';

type TableStorageState = {
  filters: {
    columnVisibility?: VisibilityState;
    [key: string]: unknown;
  };
};

describe('useColumnsVisibility', () => {
  const mockOnSetTableStorageState = jest.fn();
  const mockInitialColumnVisibilityState = { name: false };
  const mockBaseTableStorageState = {
    filters: {
      columnVisibility: mockInitialColumnVisibilityState,
    },
  };

  let currentState: TableStorageState;

  beforeEach(() => {
    currentState = {
      filters: {
        columnVisibility: { ...mockInitialColumnVisibilityState },
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

  const hook = (props?: Partial<BaseHookProps<ElevatorRecord>>): RenderHookResult<unknown, UseColumnsVisibility> =>
    renderHook(() => useColumnsVisibility({ ...defaultProps, ...props }));

  it('should return initial columnResizing state from tableStorageState', () => {
    const { result } = hook();

    expect(result.current.columnVisibility).toEqual(mockInitialColumnVisibilityState);
  });

  it('should trigger onToggleColumnVisibility and update state with direct value', () => {
    const { result } = hook();

    const mockNewState = { age: false, status: false };

    act(() => {
      result.current.onToggleColumnVisibility(mockNewState);
    });

    expect(mockOnSetTableStorageState).toHaveBeenCalled();

    expect(currentState.filters.columnVisibility).toEqual(mockNewState);
  });

  it('should trigger onToggleColumnVisibility and update state with updater function', () => {
    const { result } = hook();

    const updater = (prev: VisibilityState): VisibilityState => ({
      ...prev,
      age: false,
    });

    act(() => {
      result.current.onToggleColumnVisibility(updater);
    });

    expect(mockOnSetTableStorageState).toHaveBeenCalled();

    expect(currentState.filters.columnVisibility).toEqual({
      age: false,
      name: false,
    });
  });

  it('should set columnVisibility state when it did not exist before', () => {
    let currentState: TableStorageState = {
      filters: {},
    };

    mockOnSetTableStorageState.mockImplementation((updater) => {
      currentState = typeof updater === 'function' ? updater(currentState) : updater;
    });

    const { result } = hook({
      tableStorageState: currentState,
    });

    const newState = { age: false };

    act(() => {
      result.current.onToggleColumnVisibility(newState);
    });

    expect(currentState.filters.columnVisibility).toEqual(newState);
  });
});
