import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';
import { DateRange } from 'react-day-picker';

import { UseBaseDateRangeFilter, useBaseDateRangeFilter } from '@/shared/base-date-range-filter/hooks';
import { getSanitizeDateRange, validateDateRange } from '@/shared/base-date-range-filter/utils';
import { CHANGE_LOG_ACTIONS_STATE_STORAGE_KEY } from '@/shared/constants';
import { useBaseToast } from '@/shared/hooks';
import useStoredTableState from '@/shared/storage/hooks/useStoredState';
import { StorageEntityName } from '@/shared/types';

jest.mock('@/shared/storage/hooks/useStoredState');
jest.mock('@/shared/hooks', () => ({
  useBaseToast: jest.fn(),
}));
jest.mock('@/shared/base-date-range-filter/utils', () => ({
  ...jest.requireActual('@/shared/base-date-range-filter/utils'),
  getSanitizeDateRange: jest.fn(),
  validateDateRange: jest.fn(),
}));

describe('useBaseDateRangeFilter', () => {
  const mockSetStoredState = jest.fn();
  const mockBaseToast = jest.fn();

  const mockStoredRange = {
    from: new Date('2025-04-01'),
    to: new Date('2025-04-30'),
  };

  beforeEach(() => {
    (useStoredTableState as jest.Mock).mockReturnValue({
      storedState: { dateFilter: mockStoredRange },
      setStoredState: mockSetStoredState,
    });

    (useBaseToast as jest.Mock).mockReturnValue({
      baseToast: mockBaseToast,
    });

    (getSanitizeDateRange as jest.Mock).mockReturnValue(mockStoredRange);
    (validateDateRange as jest.Mock).mockReturnValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (): RenderHookResult<unknown, UseBaseDateRangeFilter> => {
    return renderHook(() =>
      useBaseDateRangeFilter({
        storageKey: CHANGE_LOG_ACTIONS_STATE_STORAGE_KEY,
        entityName: StorageEntityName.ChangeLogPage,
      })
    );
  };

  it('should return sanitizedDateRange from storage', () => {
    const { result } = hook();

    expect(getSanitizeDateRange).toHaveBeenCalledWith(mockStoredRange);
    expect(result.current.sanitizedDateRange).toEqual(mockStoredRange);
  });

  it('should open calendar when open is true', () => {
    const { result } = hook();

    act(() => {
      result.current.onHandleCalendarPopoverClose(true, mockStoredRange);
    });

    expect(result.current.isCalendarOpen).toBe(true);
    expect(mockSetStoredState).not.toHaveBeenCalled();
  });

  it('should store date range when calendar closes with valid range', () => {
    const { result } = hook();

    act(() => {
      result.current.onHandleCalendarPopoverClose(false, mockStoredRange);
    });

    expect(result.current.isCalendarOpen).toBe(false);
    expect(mockSetStoredState).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should show toast and not update state when range is invalid', () => {
    (validateDateRange as jest.Mock).mockReturnValue({
      title: 'Invalid range',
      message: 'From date must be before To date',
    });

    const { result } = hook();

    act(() => {
      result.current.onHandleCalendarPopoverClose(false, {
        from: new Date('2025-05-01'),
        to: new Date('2025-04-01'),
      });
    });

    expect(mockBaseToast).toHaveBeenCalledWith('Invalid range', 'From date must be before To date');

    expect(mockSetStoredState).not.toHaveBeenCalled();
  });

  it('should update storedState when closing calendar with a valid range', () => {
    const { result } = hook();

    const validRange: DateRange = {
      from: new Date('2026-01-01'),
      to: new Date('2026-01-31'),
    };

    act(() => {
      result.current.onHandleCalendarPopoverClose(false, validRange);
    });

    expect(result.current.isCalendarOpen).toBe(false);
    expect(mockSetStoredState).toHaveBeenCalledWith(expect.any(Function));

    const updateFn = mockSetStoredState.mock.calls[0][0];
    // Simulate previous state and verify that dateFilter is updated, other props stay the same
    const prevState = { filters: { selectedAction: 'Update' }, dateFilter: undefined };

    expect(updateFn(prevState)).toEqual({
      filters: { selectedAction: 'Update' },
      dateFilter: validRange,
    });
  });

  it('should not update storage when closing calendar without range', () => {
    const { result } = hook();

    act(() => {
      result.current.onHandleCalendarPopoverClose(false);
    });

    expect(mockSetStoredState).not.toHaveBeenCalled();
  });
});
