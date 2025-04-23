import { InMemoryCache, useMutation } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';

import { typePolicies } from '@/graphql/typePolicies';
import {
  mocDeleteElevatorRecordGQLError,
  mockDeleteElevatorRecord,
  mockDeleteElevatorRecordNetworkError,
} from '@/mocks/elevatorManagementMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import {
  DEFAULT_DELETE_ELEVATOR_RECORD_SUCCESS_MESSAGE,
  UseDeleteElevatorRecord,
  useDeleteElevatorRecord,
} from '@/modules/elevator-management/hooks';
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

describe('useDeleteElevatorRecord', () => {
  const mockUseMutation = jest.fn();
  const mockGqlError = [{ message: 'Simulated GQL error in result' }];
  const mockNetworkError = { message: 'Test network Error' };
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();
  const mockCacheModify = jest.fn();
  const mockDeleteElevatorRecordResponse = {
    id: 'test-id-1',
    __typename: 'DeleteElevatorRecordResponse',
  };
  const mockExistingElevatorRecords = {
    edges: [{ node: { id: 'test-id-1', name: 'Record 1' } }, { node: { id: 'test-id-2', name: 'Record 2' } }],
    total: 2,
  };

  beforeEach(() => {
    (useMutationResultToasts as jest.Mock).mockReturnValue({ onSuccess: mockOnSuccess, onError: mockOnError });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (mocks: MockedResponse[] = []): RenderHookResult<unknown, UseDeleteElevatorRecord> => {
    const cache = new InMemoryCache({
      addTypename: false,
      typePolicies,
    });

    return renderHook(() => useDeleteElevatorRecord(), {
      wrapper: ({ children }) => (
        <MockProviderHook cache={cache} mocks={mocks}>
          {children}
        </MockProviderHook>
      ),
    });
  };

  it('should return correct initial data', () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: { deleteElevatorRecord: mockDeleteElevatorRecordResponse } }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockDeleteElevatorRecord]);

    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBeFalsy();
  });

  it('should trigger onDeleteElevatorRecord with success if mutation succeeds without errors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: { deleteElevatorRecord: mockDeleteElevatorRecordResponse } }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockDeleteElevatorRecord]);

    await act(async () => {
      await result.current.onDeleteElevatorRecord('test-id-1');
    });

    expect(mockOnSuccess).toHaveBeenCalledWith(DEFAULT_DELETE_ELEVATOR_RECORD_SUCCESS_MESSAGE);
    expect(onHandleMutationErrors).not.toHaveBeenCalled();
  });

  it('should update cache when mutation is successful and Elevator Record is being deleted', async () => {
    mockUseMutation.mockImplementationOnce((_, options) => {
      options?.update(
        {
          modify: mockCacheModify,
        },
        { data: { deleteElevatorRecord: mockDeleteElevatorRecordResponse } }
      );

      return [
        jest.fn().mockResolvedValue({ data: { deleteElevatorRecord: mockDeleteElevatorRecordResponse } }),
        { loading: false },
      ];
    });

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockDeleteElevatorRecord]);

    await act(async () => {
      await result.current.onDeleteElevatorRecord('test-id-1');
    });

    expect(mockCacheModify).toHaveBeenCalledWith({
      fields: {
        getElevatorRecords: expect.any(Function),
      },
    });

    const { getElevatorRecords: customModifyFn } = mockCacheModify.mock.calls[0][0].fields;

    const modifiedElevatorRecords = customModifyFn(mockExistingElevatorRecords);

    const updatedBlocksResult = {
      ...mockExistingElevatorRecords,
      edges: [
        {
          node: {
            id: 'test-id-2',
            name: 'Record 2',
          },
        },
      ],
      total: 1,
    };

    expect(modifiedElevatorRecords).toEqual(updatedBlocksResult);
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

    const { result } = hook([mockDeleteElevatorRecord]);

    await act(async () => {
      await result.current.onDeleteElevatorRecord('test-id-1');
    });

    expect(mockCacheModify).not.toHaveBeenCalled();
  });

  it('should handle GraphQL errors and trigger onHandleMutationErrors', async () => {
    mockUseMutation.mockReturnValue([
      jest
        .fn()
        .mockResolvedValue({ data: { deleteElevatorRecord: mockDeleteElevatorRecordResponse }, errors: mockGqlError }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mocDeleteElevatorRecordGQLError]);

    await act(async () => {
      await result.current.onDeleteElevatorRecord('test-id-1');
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(onHandleMutationErrors).toHaveBeenCalledWith({
      errors: [{ message: 'Simulated GQL error in result' }],
      message: 'Fail to deleted elevator record',
      onFailure: expect.any(Function),
    });
  });

  it('should handle network error and call onHandleMutationErrors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockRejectedValue(new Error('Network Error')),
      { loading: false, error: mockNetworkError },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockDeleteElevatorRecordNetworkError]);

    await act(async () => {
      await result.current.onDeleteElevatorRecord('test-id-1');
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(onHandleMutationErrors).toHaveBeenCalledWith({
      error: expect.objectContaining({ message: 'Network Error' }),
      message: 'Fail to deleted elevator record',
      onFailure: expect.any(Function),
    });
  });
});
