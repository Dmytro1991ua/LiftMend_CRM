import { InMemoryCache, useMutation } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';

import { typePolicies } from '@/graphql/typePolicies';
import {
  mockCalendarEventId,
  mockDeleteRepairJobAndCalendarEvent,
  mockRepairJobId,
} from '@/mocks/repairJobTrackingMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import {
  DEFAULT_DELETE_CALENDAR_EVENT_AND_REPAIR_JOB_FAIL_MESSAGE,
  DEFAULT_DELETE_CALENDAR_EVENT_AND_REPAIR_JOB_SUCCESS_MESSAGE,
  UseDeleteRepairJobAndCalendarEvent,
  useDeleteRepairJobAndCalendarEvent,
} from '@/shared/hooks';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
import { onHandleMutationErrors } from '@/shared/utils';

jest.mock('@apollo/client', () => {
  const originalModule = jest.requireActual('@apollo/client');

  return {
    ...originalModule,
    useMutation: jest.fn(),
  };
});

jest.mock('@/shared/hooks/useMutationResultToasts', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    onSuccess: jest.fn(),
    onError: jest.fn(),
  })),
}));

jest.mock('@/shared/utils', () => ({
  onHandleMutationErrors: jest.fn(),
}));

describe('useDeleteRepairJobAndCalendarEvent', () => {
  const mockUseMutation = jest.fn();
  const mockGqlError = [{ message: 'Simulated GQL error in result' }];
  const mockNetworkError = { message: 'Test network Error' };
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();
  const mockCacheModify = jest.fn();
  const mockDeleteElevatorRecordResponse = {
    deletedEventId: mockCalendarEventId,
    deletedRepairJobId: mockRepairJobId,
    __typename: 'DeleteCalendarAndRepairJobResponse',
  };
  const mockExistingCalendarEvents = [
    { __ref: `CalendarEvent:${mockCalendarEventId}` },
    { __ref: 'CalendarEvent:test-calendar-id-1' },
  ];

  const mockExistingRepairJobs = {
    edges: [{ node: { __ref: `RepairJob:${mockRepairJobId}` } }, { node: { __ref: 'RepairJob:test-repair-job-id-1' } }],
    total: 2,
  };

  beforeEach(() => {
    (useMutationResultToasts as jest.Mock).mockReturnValue({ onSuccess: mockOnSuccess, onError: mockOnError });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (mocks: MockedResponse[] = []): RenderHookResult<unknown, UseDeleteRepairJobAndCalendarEvent> => {
    const cache = new InMemoryCache({
      addTypename: false,
      typePolicies,
    });

    return renderHook(() => useDeleteRepairJobAndCalendarEvent(), {
      wrapper: ({ children }) => (
        <MockProviderHook cache={cache} mocks={mocks}>
          {children}
        </MockProviderHook>
      ),
    });
  };

  it('should return correct initial data', () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: { deleteRepairJobAndEvent: mockDeleteElevatorRecordResponse } }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockDeleteRepairJobAndCalendarEvent]);

    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBeFalsy();
  });

  it('should trigger onDeleteRepairJobAndCalendarEvent with success if mutation succeeds without errors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: { deleteRepairJobAndEvent: mockDeleteElevatorRecordResponse } }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockDeleteRepairJobAndCalendarEvent]);

    await act(async () => {
      await result.current.onDeleteRepairJobAndCalendarEvent(mockCalendarEventId, mockRepairJobId);
    });

    expect(mockOnSuccess).toHaveBeenCalledWith(DEFAULT_DELETE_CALENDAR_EVENT_AND_REPAIR_JOB_SUCCESS_MESSAGE);
    expect(onHandleMutationErrors).not.toHaveBeenCalled();
  });

  it('should update cache when mutation is successful where Calendar event and Repair job are being deleted', async () => {
    mockUseMutation.mockImplementationOnce((_, options) => {
      options?.update(
        {
          modify: mockCacheModify,
        },
        { data: { deleteRepairJobAndEvent: mockDeleteElevatorRecordResponse } }
      );

      return [
        jest.fn().mockResolvedValue({ data: { deleteRepairJobAndEvent: mockDeleteElevatorRecordResponse } }),
        { loading: false },
      ];
    });

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockDeleteRepairJobAndCalendarEvent]);

    await act(async () => {
      await result.current.onDeleteRepairJobAndCalendarEvent(mockCalendarEventId, mockRepairJobId);
    });

    expect(mockCacheModify).toHaveBeenCalledWith({
      fields: {
        getCalendarEvents: expect.any(Function),
        getRepairJobs: expect.any(Function),
      },
    });

    const { getCalendarEvents, getRepairJobs } = mockCacheModify.mock.calls[0][0].fields;

    const modifiedCalendarEvents = getCalendarEvents(mockExistingCalendarEvents);
    expect(modifiedCalendarEvents).toEqual([{ __ref: 'CalendarEvent:test-calendar-id-1' }]);

    const modifiedRepairJobs = getRepairJobs(mockExistingRepairJobs);
    expect(modifiedRepairJobs).toEqual({
      edges: [{ node: { __ref: 'RepairJob:test-repair-job-id-1' } }],
      total: 1,
    });
  });

  it('should not modify the cache if data is undefined or null', async () => {
    mockUseMutation.mockImplementationOnce((_, options) => {
      options?.update(
        {
          modify: mockCacheModify,
        },
        { data: null }
      );

      return [jest.fn().mockResolvedValue({ data: null }), { loading: false }];
    });

    (useMutation as jest.Mock).mockImplementationOnce(mockUseMutation);

    const { result } = hook([mockDeleteRepairJobAndCalendarEvent]);

    await act(async () => {
      await result.current.onDeleteRepairJobAndCalendarEvent(mockCalendarEventId, mockRepairJobId);
    });

    expect(mockCacheModify).not.toHaveBeenCalled();
  });

  it('should handle GraphQL errors and trigger onHandleMutationErrors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({
        data: { deleteRepairJobAndEvent: mockDeleteElevatorRecordResponse },
        errors: mockGqlError,
      }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockDeleteRepairJobAndCalendarEvent]);

    await act(async () => {
      await result.current.onDeleteRepairJobAndCalendarEvent(mockCalendarEventId, mockRepairJobId);
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(onHandleMutationErrors).toHaveBeenCalledWith({
      errors: [{ message: 'Simulated GQL error in result' }],
      message: DEFAULT_DELETE_CALENDAR_EVENT_AND_REPAIR_JOB_FAIL_MESSAGE,
      onFailure: expect.any(Function),
    });
  });

  it('should handle network error and call onHandleMutationErrors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockRejectedValue(new Error('Network Error')),
      { loading: false, error: mockNetworkError },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockDeleteRepairJobAndCalendarEvent]);

    await act(async () => {
      await result.current.onDeleteRepairJobAndCalendarEvent(mockCalendarEventId, mockRepairJobId);
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(onHandleMutationErrors).toHaveBeenCalledWith({
      error: expect.objectContaining({ message: 'Network Error' }),
      message: DEFAULT_DELETE_CALENDAR_EVENT_AND_REPAIR_JOB_FAIL_MESSAGE,
      onFailure: expect.any(Function),
    });
  });
});
