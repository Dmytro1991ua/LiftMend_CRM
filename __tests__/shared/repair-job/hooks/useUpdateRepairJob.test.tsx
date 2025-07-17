import { InMemoryCache, useMutation } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';

import { CALENDAR_EVENT_FRAGMENT } from '@/graphql/fragments';
import { typePolicies } from '@/graphql/typePolicies';
import {
  mockRepairJob,
  mockUpdateRepairJob,
  mockUpdateRepairJobGQLError,
  mockUpdateRepairJobNetworkError,
  mockUpdatedRepairJob,
} from '@/mocks/repairJobTrackingMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
import { UseUpdateRepairJob, useUpdateRepairJob } from '@/shared/repair-job/hooks';
import { getFieldsToUpdateForMutation, onHandleMutationErrors } from '@/shared/utils';

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
  getFieldsToUpdateForMutation: jest.fn(),
}));

describe('useUpdateRepairJob', () => {
  const mockUseMutation = jest.fn();
  const mockGqlError = [{ message: 'Simulated GQL error in result' }];
  const mockNetworkError = { message: 'Test network Error' };
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();
  const mockReadFragment = jest.fn();
  const mockWriteFragment = jest.fn();
  const mockFormValues = {
    ...mockRepairJob,
    jobDetails: 'Test description',
    status: 'In Progress',
  };
  const mockDeleteElevatorRecordResponse = {
    ...mockRepairJob,
    jobDetails: 'Test description',
    __typename: 'RepairJob',
  };
  const expectedUpdatedEvent = {
    description: `Repair Job for ${mockDeleteElevatorRecordResponse.elevatorType} at ${mockDeleteElevatorRecordResponse.buildingName} - ${mockDeleteElevatorRecordResponse.elevatorLocation}`,
    title: `${mockDeleteElevatorRecordResponse.jobType} Repair Job`,
  };

  beforeEach(() => {
    (useMutationResultToasts as jest.Mock).mockReturnValue({ onSuccess: mockOnSuccess, onError: mockOnError });

    (getFieldsToUpdateForMutation as jest.Mock).mockReturnValue({
      jobDetails: 'Test description',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (mocks: MockedResponse[] = []): RenderHookResult<unknown, UseUpdateRepairJob> => {
    const cache = new InMemoryCache({
      addTypename: false,
      typePolicies,
    });

    return renderHook(() => useUpdateRepairJob(), {
      wrapper: ({ children }) => (
        <MockProviderHook cache={cache} mocks={mocks}>
          {children}
        </MockProviderHook>
      ),
    });
  };

  it('should return correct initial data', () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: { updateRepairJob: mockUpdatedRepairJob } }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockUpdateRepairJob]);

    expect(result.current.isLoading).toBeFalsy();
  });

  it('should trigger onUpdateRepairJob with success when the mutation succeeds without errors.', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: { updateRepairJob: mockUpdatedRepairJob } }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockUpdateRepairJob]);

    await act(async () => {
      await result.current.onUpdateRepairJob(mockFormValues);
    });

    expect(mockOnSuccess).toHaveBeenCalledWith('Successfully updated scheduled Routine repair job', undefined);
    expect(onHandleMutationErrors).not.toHaveBeenCalledWith();
  });

  it('should update cache when mutation is successful and Repair Job is being updated', async () => {
    mockUseMutation.mockImplementationOnce((_, options) => {
      options?.update(
        {
          readFragment: mockReadFragment,
          writeFragment: mockWriteFragment,
        },
        { data: { updateRepairJob: mockDeleteElevatorRecordResponse } }
      );

      return [
        jest.fn().mockResolvedValue({ data: { deleteElevatorRecord: mockDeleteElevatorRecordResponse } }),
        { loading: false },
      ];
    });

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockUpdateRepairJob]);

    await act(async () => {
      await result.current.onUpdateRepairJob(mockFormValues);
    });

    expect(mockReadFragment).toHaveBeenCalledWith({
      id: `CalendarEvent:${mockRepairJob.calendarEventId}`,
      fragment: CALENDAR_EVENT_FRAGMENT,
    });

    expect(mockWriteFragment).toHaveBeenCalledWith({
      id: `CalendarEvent:${mockRepairJob.calendarEventId}`,
      fragment: CALENDAR_EVENT_FRAGMENT,
      data: expectedUpdatedEvent,
    });
  });

  it('should not modify the cache if data is undefined or null', async () => {
    mockUseMutation.mockImplementationOnce((_, options) => {
      options?.update(
        {
          readFragment: mockReadFragment,
          writeFragment: mockWriteFragment,
        },
        { data: null }
      );

      return [jest.fn().mockResolvedValue({ data: null }), { loading: false }];
    });

    (useMutation as jest.Mock).mockImplementationOnce(mockUseMutation);

    const { result } = hook([mockUpdateRepairJob]);

    await act(async () => {
      await result.current.onUpdateRepairJob(mockFormValues);
    });

    expect(mockReadFragment).not.toHaveBeenCalled();
    expect(mockWriteFragment).not.toHaveBeenCalled();
  });

  it('should handle GraphQL errors and trigger onHandleMutationErrors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: undefined, errors: mockGqlError }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockUpdateRepairJobGQLError]);

    await act(async () => {
      await result.current.onUpdateRepairJob(mockFormValues);
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(onHandleMutationErrors).toHaveBeenCalledWith({
      errors: [{ message: 'Simulated GQL error in result' }],
      message: 'Fail to update Routine repair job',
      onFailure: expect.any(Function),
    });
  });

  it('should handle network error and call onHandleMutationErrors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockRejectedValue({ message: 'Network Error' }),
      { loading: false, error: mockNetworkError },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockUpdateRepairJobNetworkError]);

    await act(async () => {
      await result.current.onUpdateRepairJob(mockFormValues);
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(onHandleMutationErrors).toHaveBeenCalledWith({
      error: expect.objectContaining({ message: 'Network Error' }),
      message: 'Update Repair Job Fail',
      onFailure: expect.any(Function),
    });
  });
});
