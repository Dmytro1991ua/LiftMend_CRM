import { act } from '@testing-library/react';
import { RenderHookResult, renderHook } from '@testing-library/react-hooks';
import { endOfDay, startOfDay } from 'date-fns';

import { UseDatePicker, UseDatePickerProps, useDatePicker } from '@/shared/date-picker/hooks';

describe('useDatePicker', () => {
  const mockFromDate = new Date('2024-08-12T08:00:00Z');
  const mockToDate = new Date('2024-08-20T12:00:00Z');
  const mockSingleDate = new Date('2024-09-13T09:30:00Z');
  const mockNewDate = new Date('2024-10-20T10:23:36Z');
  const mockNewDate2 = new Date('2024-10-22T12:23:36Z');
  const mockOnChange = jest.fn();
  const mockOnSingleDateChange = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps: UseDatePickerProps = {
    dateRange: {
      from: mockFromDate,
      to: mockToDate,
    },
    singleDate: mockSingleDate,
    onChange: mockOnChange,
    onSingleDateChange: mockOnSingleDateChange,
  };

  const hook = (props?: Partial<UseDatePickerProps>): RenderHookResult<unknown, UseDatePicker> =>
    renderHook(() => useDatePicker({ ...defaultProps, ...props }));

  it('should return correct initial hook data', () => {
    const { result } = hook();

    expect(result.current.dateRangeState).toEqual(defaultProps.dateRange);
    expect(result.current.singleDateState).toEqual(defaultProps.singleDate);
  });

  it('should call onHandleTimeChange and update single date if singleDateState defined', () => {
    const { result } = hook();

    act(() => result.current.onHandleTimeChange(mockNewDate));

    expect(result.current.singleDateState).toEqual(mockNewDate);
    expect(mockOnSingleDateChange).toHaveBeenCalledWith(mockNewDate);
  });

  it('should update the date range "from" value when isStart is true', () => {
    const { result } = hook({ singleDate: undefined });

    act(() => {
      result.current.onHandleTimeChange(mockNewDate, true);
    });

    const mockOutput = { from: mockNewDate, to: mockToDate };

    expect(result.current.dateRangeState).toEqual(mockOutput);
    expect(mockOnChange).toHaveBeenCalledWith(mockOutput);
  });

  it('should update date range "to" value when isStart is false', () => {
    const { result } = hook({ singleDate: undefined });

    act(() => {
      result.current.onHandleTimeChange(mockNewDate, false);
    });

    const mockOutput = { from: mockFromDate, to: mockNewDate };

    expect(result.current.dateRangeState).toEqual(mockOutput);
    expect(mockOnChange).toHaveBeenCalledWith(mockOutput);
  });

  it('should call onChange with the updated date range and set dateRangeState state', () => {
    const { result } = hook({ singleDate: undefined });

    act(() => {
      result.current.onHandleTimeChange(mockNewDate, true);
    });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith({ from: mockNewDate, to: mockToDate });
  });

  it('should call onHandleSelectDates and update both "from" and "to" date range', () => {
    const { result } = hook({ singleDate: undefined });

    act(() => {
      result.current.onHandleSelectDates({ from: mockNewDate, to: mockNewDate2 });
    });

    const mockOutput = { from: startOfDay(mockNewDate), to: endOfDay(mockNewDate2) };

    expect(result.current.dateRangeState).toEqual(mockOutput);
    expect(mockOnChange).toHaveBeenCalledWith(mockOutput);
  });

  it('should call onHandleSelectDates and update only "from" date range when "to" is not provided', () => {
    const { result } = hook({ singleDate: undefined });

    act(() => {
      result.current.onHandleSelectDates({ from: mockNewDate, to: undefined });
    });

    const mockOutput = { from: startOfDay(mockNewDate), to: undefined };

    expect(result.current.dateRangeState).toEqual(mockOutput);
    expect(mockOnChange).toHaveBeenCalledWith(mockOutput);
  });

  it('should call onHandleSelectDates and update only "to" date range when "from" is not provided', () => {
    const { result } = hook({ singleDate: undefined });

    act(() => {
      result.current.onHandleSelectDates({ from: undefined, to: mockNewDate });
    });

    const mockOutput = { from: undefined, to: endOfDay(mockNewDate) };

    expect(result.current.dateRangeState).toEqual(mockOutput);
    expect(mockOnChange).toHaveBeenCalledWith(mockOutput);
  });

  it('should handle onHandleSelectDates with undefined range', () => {
    const { result } = hook({ singleDate: undefined });

    act(() => {
      result.current.onHandleSelectDates(undefined);
    });

    expect(result.current.dateRangeState).toEqual({ from: undefined, to: undefined });
    expect(mockOnChange).toHaveBeenCalledWith({ from: undefined, to: undefined });
  });

  it('should update singleDateState and call onSingleDateChange when date is provided', () => {
    const { result } = hook();

    act(() => {
      result.current.onHandleSelectSingleDate(mockNewDate);
    });

    expect(result.current.singleDateState).toEqual(mockNewDate);
    expect(mockOnSingleDateChange).toHaveBeenCalledWith(mockNewDate);
  });

  it('should set singleDateState to undefined and call onSingleDateChange with undefined when no date is provided', () => {
    const { result } = hook();

    act(() => {
      result.current.onHandleSelectSingleDate(undefined);
    });

    expect(result.current.singleDateState).toBeUndefined();
    expect(mockOnSingleDateChange).toHaveBeenCalledWith(undefined);
  });
});
