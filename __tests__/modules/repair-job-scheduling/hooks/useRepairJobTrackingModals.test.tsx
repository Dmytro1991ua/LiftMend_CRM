import { DateSelectArg } from '@fullcalendar/core';
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { useToast } from '@/components/ui/use-toast';
import { useRepairJobTrackingModals } from '@/modules/repair-job-scheduling/hooks';

jest.mock('@/components/ui/use-toast');
jest.mock('date-fns', () => {
  const original = jest.requireActual('date-fns');

  return {
    ...original,
    startOfToday: () => new Date('2025-05-14T00:00:00.000Z'),
  };
});

describe('useRepairJobTrackingModals', () => {
  const mockToast = jest.fn();

  beforeEach(() => {
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = () => renderHook(() => useRepairJobTrackingModals());

  it('should return correct initial hook data', () => {
    const { result } = hook();

    expect(result.current.isCreateEventModalOpen).toBe(false);
    expect(result.current.isDeleteEventModalOpen).toBe(false);
    expect(result.current.selectedDateRange).toBe(null);
  });

  it('should trigger onOpenCreateEventModal and open Create Event modal', () => {
    const { result } = hook();

    act(() => result.current.onOpenCreateEventModal());

    expect(result.current.isCreateEventModalOpen).toBe(true);
  });

  it('should trigger onCloseCreateEventModal and close Create Event modal', () => {
    const { result } = hook();

    act(() => result.current.onCloseCreateEventModal());

    expect(result.current.isCreateEventModalOpen).toBe(false);
  });

  it('should trigger onOpenDeleteEventModal and open Delete Event modal', () => {
    const { result } = hook();

    act(() => result.current.onOpenDeleteEventModal());

    expect(result.current.isDeleteEventModalOpen).toBe(true);
  });

  it('should trigger onCloseDeleteEventModal and close Delete Event modal', () => {
    const { result } = hook();

    act(() => result.current.onCloseDeleteEventModal());

    expect(result.current.isDeleteEventModalOpen).toBe(false);
  });

  it('should trigger onHandleDateClick and show toast when selectedDate start is less that today date', () => {
    const mockSelectedDateRange = {
      start: new Date('2025-05-13T00:00:00.000Z'),
      end: new Date('2025-05-13T23:59:00.000Z'),
      allDay: true,
    } as DateSelectArg;

    const { result } = hook();

    act(() => result.current.onHandleDateClick(mockSelectedDateRange));

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: 'warning',
        action: expect.anything(),
      })
    );
  });

  it('should set selected date and open modal when selectedDate start is today or future', () => {
    const mockSelectedDateRange = {
      start: new Date('2025-05-15T00:00:00.000Z'),
      end: new Date('2025-05-15T23:59:00.000Z'),
      allDay: true,
    } as DateSelectArg;

    const { result } = hook();

    act(() => {
      result.current.onHandleDateClick(mockSelectedDateRange);
    });

    expect(result.current.selectedDateRange).toEqual(mockSelectedDateRange);
    expect(result.current.isCreateEventModalOpen).toBe(true);
  });
});
