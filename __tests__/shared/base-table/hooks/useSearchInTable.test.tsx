import { waitFor } from '@testing-library/react';
import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';

import { GetElevatorRecordsQuery, QueryGetElevatorRecordsArgs } from '@/graphql/types/client/generated_types';
import { useSearchInTable } from '@/shared/base-table/hooks';
import { UseSearchInTable, UseSearchInTableProps } from '@/shared/base-table/hooks/types';
import { DEFAULT_PAGINATION } from '@/shared/constants';
import { ElevatorRecord } from '@/shared/types';

type TableStorageState = {
  filters?: {
    searchTerm?: string;
  };
};

describe('useSearchInTable', () => {
  const mockOnSetTableStorageState = jest.fn();
  const mockRefetch = jest.fn();
  const mockInitialSearchTermState = 'test-search-term';
  const mockBaseTableStorageState = {
    filters: {
      searchTerm: mockInitialSearchTermState,
    },
  };

  let currentState: TableStorageState;

  beforeEach(() => {
    currentState = {
      filters: {
        searchTerm: mockInitialSearchTermState,
      },
    };

    mockOnSetTableStorageState.mockImplementation((updater) => {
      currentState = typeof updater === 'function' ? updater(currentState) : updater;
    });

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  const defaultProps = {
    tableStorageState: mockBaseTableStorageState,
    onSetTableStorageState: mockOnSetTableStorageState,
    refetch: mockRefetch,
  };

  const hook = (
    props?: Partial<UseSearchInTableProps<ElevatorRecord, QueryGetElevatorRecordsArgs, GetElevatorRecordsQuery>>
  ): RenderHookResult<unknown, UseSearchInTable> => renderHook(() => useSearchInTable({ ...defaultProps, ...props }));

  it('should return initial searchTerm state from tableStorageState', () => {
    const { result } = hook();

    expect(result.current.searchTerm).toEqual(mockInitialSearchTermState);
  });

  it('should update search term and trigger refetch on onSearch', async () => {
    const { result } = hook();

    const mockEvent = {
      target: { value: 'Status' },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.onSearch(mockEvent);
    });

    expect(result.current.searchTerm).toBe('status');
    expect(mockOnSetTableStorageState).not.toHaveBeenCalled();
    expect(mockRefetch).not.toHaveBeenCalled();

    // Run debounce
    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(mockOnSetTableStorageState).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalledWith({
        paginationOptions: DEFAULT_PAGINATION,
        filterOptions: { searchTerm: 'status' },
      });
    });
  });

  it('should clear search term on onClearSearch', async () => {
    const { result } = hook();

    await act(async () => {
      await result.current.onClearSearch();
    });

    expect(result.current.searchTerm).toBe('');
    expect(mockOnSetTableStorageState).toHaveBeenCalled();
    expect(mockRefetch).toHaveBeenCalledWith({
      paginationOptions: DEFAULT_PAGINATION,
      filterOptions: { searchTerm: '' },
    });
  });
});
