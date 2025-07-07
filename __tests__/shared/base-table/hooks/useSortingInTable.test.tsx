import { SortingState } from '@tanstack/react-table';
import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';

import { BaseHookProps, UseSorting } from '@/shared/base-table/hooks/types';
import useSortingInTable from '@/shared/base-table/hooks/useSortingInTable';
import { ElevatorRecord } from '@/shared/types';

type TableStorageState = {
  sorting?: SortingState;
};

describe('useSortingInTable', () => {
  const mockOnSetTableStorageState = jest.fn();
  const mockInitialSortingState = { id: 'elevatorType', desc: false };
  const mockBaseTableStorageState = {
    sorting: [mockInitialSortingState],
  };

  let currentState: TableStorageState;

  beforeEach(() => {
    currentState = {
      sorting: [{ ...mockInitialSortingState }],
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

  const hook = (props?: Partial<BaseHookProps<ElevatorRecord>>): RenderHookResult<unknown, UseSorting> =>
    renderHook(() => useSortingInTable({ ...defaultProps, ...props }));

  it('should return initial sorting state from tableStorageState', () => {
    const { result } = hook();

    expect(result.current.sorting).toEqual([mockInitialSortingState]);
  });

  it('should trigger onSetSorting and update state with direct value', () => {
    const { result } = hook();

    const mockNewState = [{ id: 'status', desc: true }];

    act(() => {
      result.current.onSetSorting(mockNewState);
    });

    expect(mockOnSetTableStorageState).toHaveBeenCalled();

    expect(currentState.sorting).toEqual(mockNewState);
  });

  it('should trigger onSetSorting and update state with updater function', () => {
    const { result } = hook();

    const mockNewState = [{ id: 'age', desc: false }];

    const updater = (prev: SortingState): SortingState => [...prev, ...mockNewState];

    act(() => {
      result.current.onSetSorting(updater);
    });

    expect(mockOnSetTableStorageState).toHaveBeenCalled();

    expect(currentState.sorting).toEqual([
      { desc: false, id: 'elevatorType' },
      { desc: false, id: 'age' },
    ]);
  });

  it('should handle empty initial sorting state', () => {
    const emptyState = { sorting: undefined };

    const { result } = hook({ tableStorageState: emptyState });

    expect(result.current.sorting).toEqual([]);
  });
});
