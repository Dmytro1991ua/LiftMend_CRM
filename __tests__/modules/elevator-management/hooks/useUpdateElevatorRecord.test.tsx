import { InMemoryCache, useMutation } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';

import { typePolicies } from '@/graphql/typePolicies';
import {
  mockElevatorRecord,
  mockUpdateElevatorRecord,
  mockUpdateElevatorRecordGQLError,
  mockUpdateElevatorRecordNetworkError,
  mockUpdatedElevatorRecord,
} from '@/mocks/elevatorManagementMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import { UseUpdateElevatorRecord, useUpdateElevatorRecord } from '@/modules/elevator-management/hooks';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
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

describe('useUpdateElevatorRecord', () => {
  const mockUseMutation = jest.fn();
  const mockGqlError = [{ message: 'Simulated GQL error in result' }];
  const mockNetworkError = { message: 'Test network Error' };
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();
  const mockFormValues = {
    ...mockElevatorRecord,
    nextMaintenanceDate: new Date('2024-09-10T16:00:00.000Z'),
  };

  beforeEach(() => {
    (useMutationResultToasts as jest.Mock).mockReturnValue({ onSuccess: mockOnSuccess, onError: mockOnError });

    (getFieldsToUpdateForMutation as jest.Mock).mockReturnValue({
      nextMaintenanceDate: new Date('2024-09-10T16:00:00.000Z'),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (mocks: MockedResponse[] = []): RenderHookResult<unknown, UseUpdateElevatorRecord> => {
    const cache = new InMemoryCache({
      addTypename: false,
      typePolicies,
    });

    return renderHook(() => useUpdateElevatorRecord(), {
      wrapper: ({ children }) => (
        <MockProviderHook cache={cache} mocks={mocks}>
          {children}
        </MockProviderHook>
      ),
    });
  };

  it('should return correct initial data', () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: { updateElevatorRecord: mockUpdatedElevatorRecord } }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockUpdateElevatorRecord]);

    expect(result.current.isLoading).toBeFalsy();
  });

  it('Should trigger onUpdateElevatorRecord with success when the mutation succeeds without errors.', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: { updateElevatorRecord: mockUpdateElevatorRecord } }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockUpdateElevatorRecord]);

    await act(async () => {
      await result.current.onUpdateElevatorRecord(mockFormValues);
    });

    expect(mockOnSuccess).toHaveBeenCalledWith('Successfully updated Scenic Elevator elevator record');
    expect(onHandleMutationErrors).not.toHaveBeenCalledWith();
  });

  it('should handle GraphQL errors and trigger onHandleMutationErrors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: undefined, errors: mockGqlError }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockUpdateElevatorRecordGQLError]);

    await act(async () => {
      await result.current.onUpdateElevatorRecord(mockFormValues);
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(onHandleMutationErrors).toHaveBeenCalledWith({
      errors: [{ message: 'Simulated GQL error in result' }],
      message: 'Fail to update Scenic Elevator elevator record',
      onFailure: expect.any(Function),
    });
  });

  it('should handle network error and call onHandleMutationErrors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockRejectedValue({ message: 'Network Error' }),
      { loading: false, error: mockNetworkError },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockUpdateElevatorRecordNetworkError]);

    await act(async () => {
      await result.current.onUpdateElevatorRecord(mockFormValues);
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(onHandleMutationErrors).toHaveBeenCalledWith({
      error: expect.objectContaining({ message: 'Network Error' }),
      message: 'Update Elevator Record Fail',
      onFailure: expect.any(Function),
    });
  });
});
