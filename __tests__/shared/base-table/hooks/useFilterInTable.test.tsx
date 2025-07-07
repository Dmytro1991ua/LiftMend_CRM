import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';

import { DropdownOption } from '@/shared/base-select/types';
import { BaseHookProps, UseFilterInTable } from '@/shared/base-table/hooks/types';
import useFilterInTable from '@/shared/base-table/hooks/useFilterInTable';
import { FilterKey, TableFilters } from '@/shared/base-table/types';
import { ElevatorRecord } from '@/shared/types';

type TableStorageState = {
  filters: TableFilters<ElevatorRecord>;
};

describe('useFilterInTable', () => {
  const mockOnSetTableStorageState = jest.fn();
  const mockOption1: DropdownOption = { label: 'Option 1', value: 'opt1' };
  const mockOption2: DropdownOption = { label: 'Option 2', value: 'opt2' };
  const mockInitialFilterValues = {
    [FilterKey.Certifications]: [mockOption1],
  };
  const mockBaseTableStorageState: TableStorageState = {
    filters: {
      filterValues: mockInitialFilterValues,
    },
  };

  let currentState: TableStorageState;

  beforeEach(() => {
    currentState = {
      filters: {
        filterValues: { ...mockInitialFilterValues },
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

  const hook = (
    props?: Partial<BaseHookProps<ElevatorRecord>>
  ): RenderHookResult<unknown, UseFilterInTable<ElevatorRecord>> =>
    renderHook(() => useFilterInTable({ ...defaultProps, ...props }));

  it('should return initial filters state from tableStorageState', () => {
    const { result } = hook();

    expect(result.current.filters).toEqual({ filterValues: mockInitialFilterValues });
  });

  it('should update filters with radio button filter (replace existing)', () => {
    const { result } = hook();

    act(() => {
      result.current.onFilterChange(FilterKey.Certifications, mockOption2, 'radio');
    });

    expect(mockOnSetTableStorageState).toHaveBeenCalled();
    expect(currentState.filters.filterValues?.[FilterKey.Certifications]).toEqual([mockOption2]);
  });

  it('should toggle checkbox filter and add new filter option', () => {
    const { result } = hook();

    act(() => {
      result.current.onFilterChange(FilterKey.Certifications, mockOption2, 'checkbox');
    });

    expect(currentState.filters.filterValues?.[FilterKey.Certifications]).toEqual([mockOption1, mockOption2]);
  });

  it('should toggle checkbox filter and remove existing option', () => {
    const { result } = hook();

    act(() => {
      result.current.onFilterChange(FilterKey.Certifications, mockOption1, 'checkbox');
    });

    expect(currentState.filters.filterValues?.[FilterKey.Certifications]).toEqual([]);
  });

  it('should clear the filter for given filter key', () => {
    const { result } = hook();

    act(() => {
      result.current.onClearFilter(FilterKey.Certifications);
    });

    expect(currentState.filters.filterValues?.[FilterKey.Certifications]).toEqual([]);
  });

  it('should set filter value when filterValues is initially undefined', () => {
    currentState = {
      filters: {},
    };

    mockOnSetTableStorageState.mockImplementation((updater) => {
      currentState = typeof updater === 'function' ? updater(currentState) : updater;
    });

    const { result } = hook({
      tableStorageState: currentState,
    });

    act(() => {
      result.current.onFilterChange(FilterKey.Certifications, mockOption2, 'checkbox');
    });

    expect(currentState.filters.filterValues?.[FilterKey.Certifications]).toEqual([mockOption2]);
  });
});
