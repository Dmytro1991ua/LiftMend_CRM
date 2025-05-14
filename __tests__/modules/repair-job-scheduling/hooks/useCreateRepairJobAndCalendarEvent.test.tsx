import { InMemoryCache, useMutation } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';

import { GET_CALENDAR_EVENTS } from '@/graphql/schemas';
import { typePolicies } from '@/graphql/typePolicies';
import {
  mockCalendarEvent,
  mockCreateRepairJobAndCalendarEventResponse,
  mockRepairJob,
  mockSelectedDateRange,
} from '@/mocks/repairJobScheduling';
import { MockProviderHook } from '@/mocks/testMocks';
import {
  UseCreateRepairJobAndCalendarEvent,
  useCreateRepairJobAndCalendarEvent,
} from '@/modules/repair-job-scheduling/hooks/useCreateRepairJobAndCalendarEvent';
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
  ...jest.requireActual('@/shared/utils'),
  onHandleMutationErrors: jest.fn(),
}));

describe('useCreateRepairJobAndCalendarEvent', () => {
  const mockUseMutation = jest.fn();
  const mockGqlError = [{ message: 'Simulated GQL error in result' }];
  const mockNetworkError = { message: 'Test network Error' };
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();
  const mockWriteQuery = jest.fn();
  const mockReadQuery = jest.fn();

  const mockFormValues = {
    jobDetails: {
      jobType: 'Consultation',
      jobDescription: 'asdasdadasdasdasd',
      priority: 'High',
    },
    elevatorInformation: {
      elevatorType: 'Ship Elevator',
      buildingName: 'Bayview Condominiums',
      elevatorLocation: 'Kitchen',
    },
    technicianAssignment: {
      technicianName: 'Charles Robinson',
    },
  };
  const mockCreatedJobAndEventResponse = {
    repairJob: {
      ...mockRepairJob,
      __typename: 'RepairJob',
    },
    calendarEvent: { ...mockCalendarEvent, __typename: 'CalendarEvent' },
  };
  const mockExistingEvents = {
    getCalendarEvents: [
      {
        id: 'existing-event-id-1',
        title: 'Existing Event',
        start: '2025-05-01T00:00:00.000Z',
        end: '2025-05-01T23:59:59.999Z',
        description: 'Existing calendar event',
        allDay: true,
        repairJobId: 'existing-repair-job-id',
        __typename: 'CalendarEvent',
      },
    ],
  };

  beforeEach(() => {
    (useMutationResultToasts as jest.Mock).mockReturnValue({ onSuccess: mockOnSuccess, onError: mockOnError });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (mocks: MockedResponse[] = []): RenderHookResult<unknown, UseCreateRepairJobAndCalendarEvent> => {
    const cache = new InMemoryCache({
      addTypename: false,
      typePolicies,
    });

    return renderHook(() => useCreateRepairJobAndCalendarEvent(), {
      wrapper: ({ children }) => (
        <MockProviderHook cache={cache} mocks={mocks}>
          {children}
        </MockProviderHook>
      ),
    });
  };

  it('should return correct initial data', () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({
        data: {
          createRepairJobAndEvent: {
            ...mockCreatedJobAndEventResponse,
          },
        },
      }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockCreateRepairJobAndCalendarEventResponse]);

    expect(result.current.isLoading).toBeFalsy();
  });

  it('Should trigger onCreateRepairJobAndEvent with success when the mutation succeeds without errors.', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({
        data: {
          createRepairJobAndEvent: {
            ...mockCreatedJobAndEventResponse,
          },
        },
      }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockCreateRepairJobAndCalendarEventResponse]);

    await act(async () => {
      await result.current.onCreateRepairJobAndEvent(mockFormValues, mockSelectedDateRange);
    });

    expect(mockOnSuccess).toHaveBeenCalledWith('Successfully scheduled repair job');
    expect(onHandleMutationErrors).not.toHaveBeenCalledWith();
  });

  it('should update cache when mutation is successful and Repair Job with associated Event is being created', async () => {
    mockReadQuery.mockReturnValue(mockExistingEvents);
    mockUseMutation.mockImplementationOnce((_, options) => {
      options?.update(
        {
          writeQuery: mockWriteQuery,
          readQuery: mockReadQuery,
        },
        {
          data: {
            createRepairJobAndEvent: {
              ...mockCreatedJobAndEventResponse,
            },
          },
        }
      );

      return [
        jest.fn().mockResolvedValue({
          data: {
            createRepairJobAndEvent: {
              ...mockCreatedJobAndEventResponse,
            },
          },
        }),
        { loading: false },
      ];
    });

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockCreateRepairJobAndCalendarEventResponse]);

    await act(async () => {
      await result.current.onCreateRepairJobAndEvent(mockFormValues, mockSelectedDateRange);
    });

    expect(mockReadQuery).toHaveBeenCalledWith({
      query: GET_CALENDAR_EVENTS,
    });

    expect(mockWriteQuery).toHaveBeenCalledWith({
      query: GET_CALENDAR_EVENTS,
      data: {
        getCalendarEvents: [mockCreatedJobAndEventResponse.calendarEvent, ...mockExistingEvents.getCalendarEvents],
      },
    });
  });

  it('should not modify the cache if data is undefined or null', async () => {
    mockUseMutation.mockImplementationOnce((_, options) => {
      options?.update(
        {
          writeQuery: mockWriteQuery,
          readQuery: mockReadQuery,
        },
        { data: null }
      );

      return [jest.fn().mockResolvedValue({ data: null }), { loading: false }];
    });

    const { result } = hook([mockCreateRepairJobAndCalendarEventResponse]);

    await act(async () => {
      await result.current.onCreateRepairJobAndEvent(mockFormValues, mockSelectedDateRange);
    });

    expect(mockReadQuery).not.toHaveBeenCalled();
    expect(mockWriteQuery).not.toHaveBeenCalled();
  });

  it('should handle GraphQL errors and trigger onHandleMutationErrors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: undefined, errors: mockGqlError }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockCreateRepairJobAndCalendarEventResponse]);

    await act(async () => {
      await result.current.onCreateRepairJobAndEvent(mockFormValues, mockSelectedDateRange);
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(onHandleMutationErrors).toHaveBeenCalledWith({
      errors: [{ message: 'Simulated GQL error in result' }],
      message: 'Failed to schedule repair job',
      onFailure: expect.any(Function),
    });
  });

  it('should handle network error and call onHandleMutationErrors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockRejectedValue({ message: 'Network Error' }),
      { loading: false, error: mockNetworkError },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockCreateRepairJobAndCalendarEventResponse]);

    await act(async () => {
      await result.current.onCreateRepairJobAndEvent(mockFormValues, mockSelectedDateRange);
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(onHandleMutationErrors).toHaveBeenCalledWith({
      error: expect.objectContaining({ message: 'Network Error' }),
      message: 'Failed to schedule repair job',
      onFailure: expect.any(Function),
    });
  });
});
