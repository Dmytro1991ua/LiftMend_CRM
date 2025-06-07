import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { mockCalendarEventInfo } from '@/mocks/repairJobScheduling';
import { UseBaseCalendarProps, useBaseCalendar } from '@/shared/base-calendar/hooks';

describe('useBaseCalendar', () => {
  const mockOnOpenDeleteEventModal = jest.fn();
  const mockOnDeleteCalendarEvent = jest.fn();
  const mockOnCloseDeleteEventModal = jest.fn();
  const mockOnHandleDateClick = jest.fn();

  const defaultProps = {
    calendarActions: {
      isDeleteEventModalOpen: false,
      isLoading: false,
      onOpenDeleteEventModal: mockOnOpenDeleteEventModal,
      onDeleteCalendarEvent: mockOnDeleteCalendarEvent,
      onCloseDeleteEventModal: mockOnCloseDeleteEventModal,
      onHandleDateClick: mockOnHandleDateClick,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const hook = (props?: Partial<UseBaseCalendarProps>) =>
    renderHook(() => useBaseCalendar({ ...defaultProps, ...props }));

  it('should set eventToDelete when onSetCalendarEvent is called', () => {
    const { result } = hook();

    act(() => {
      result.current.onSetCalendarEvent(mockCalendarEventInfo);
    });

    act(() => {
      result.current.onDeleteCalendarEventAndRepairJob();
    });

    expect(mockOnDeleteCalendarEvent).toHaveBeenCalledWith(
      '9cc89880-6731-4388-adac-646a8761059a',
      'd550fa3e-19cd-4f2b-bfb4-2ce527e0dc06'
    );
  });

  it('should not call onDeleteCalendarEvent if no event is set', () => {
    const { result } = hook();

    act(() => {
      result.current.onDeleteCalendarEventAndRepairJob();
    });

    expect(mockOnDeleteCalendarEvent).not.toHaveBeenCalled();
  });

  it('should reset eventToDelete after deletion', () => {
    const { result } = hook();

    act(() => {
      result.current.onSetCalendarEvent(mockCalendarEventInfo);
    });

    // First call: eventToDelete is set, so it calls onDeleteCalendarEvent and then resets eventToDelete to null.
    act(() => {
      result.current.onDeleteCalendarEventAndRepairJob();
    });

    // Second call: eventToDelete is now null (reset from the previous call),
    // so this time onDeleteCalendarEvent should NOT be called again.
    act(() => {
      result.current.onDeleteCalendarEventAndRepairJob();
    });

    expect(mockOnDeleteCalendarEvent).toHaveBeenCalledTimes(1);
  });
});
