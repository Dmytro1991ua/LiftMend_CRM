import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';

import { MockProviderHook } from '@/mocks/testMocks';
import { useDeleteRepairJobAndCalendarEvent } from '@/shared/hooks';
import { UseRepairJobDeletion, useRepairJobDeletion } from '@/shared/repair-job/hooks';

useDeleteRepairJobAndCalendarEvent;

jest.mock('@/shared/hooks', () => ({
  ...jest.requireActual('@/shared/hooks'),
  useDeleteRepairJobAndCalendarEvent: jest.fn(),
}));

describe('useRepairJobDeletion', () => {
  const mockOnCloseModal = jest.fn();
  const mockOnRedirect = jest.fn();
  const mockOnDeleteRepairJobAndCalendarEvent = jest.fn();
  const mockCalendarEventId = 'test_calendar_id_1';
  const mockRepairJobId = 'test_repair_job_id_1';

  beforeEach(() => {
    (useDeleteRepairJobAndCalendarEvent as jest.Mock).mockReturnValue({
      onDeleteRepairJobAndCalendarEvent: mockOnDeleteRepairJobAndCalendarEvent,
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    calendarEventId: mockCalendarEventId,
    repairJobId: mockRepairJobId,
    onCloseModal: mockOnCloseModal,
    onRedirect: mockOnRedirect,
  };

  const hook = (): RenderHookResult<unknown, UseRepairJobDeletion> => {
    return renderHook(() => useRepairJobDeletion(defaultProps), {
      wrapper: ({ children }) => <MockProviderHook mocks={[]}>{children}</MockProviderHook>,
    });
  };

  it('should return correct initial data', () => {
    const { result } = hook();

    expect(result.current.isDeleteRepairJobLoading).toBeFalsy();
  });

  it('should trigger onDeleteRepairJob, close modal and redirect', async () => {
    const { result } = hook();

    await act(() => result.current.onDeleteRepairJob());

    expect(mockOnCloseModal).toHaveBeenCalled();
    expect(mockOnRedirect).toHaveBeenCalled();
  });

  it('should trigger onDeleteCalendarEvent and close modal', async () => {
    const { result } = hook();

    await act(() => result.current.onDeleteCalendarEvent(mockCalendarEventId, mockRepairJobId));

    expect(mockOnCloseModal).toHaveBeenCalled();
    expect(mockOnDeleteRepairJobAndCalendarEvent).toHaveBeenCalledWith(mockCalendarEventId, mockRepairJobId);
  });
});
