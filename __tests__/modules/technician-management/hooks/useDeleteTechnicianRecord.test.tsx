import { InMemoryCache, useMutation } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';

import { typePolicies } from '@/graphql/typePolicies';
import {
  mockBenjaminHallRecordId,
  mockDeleteTechnicianRecord,
  mockDeleteTechnicianRecordGQLError,
  mockDeleteTechnicianRecordNetworkError,
} from '@/mocks/technicianManagementMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import {
  DEFAULT_DELETE_TECHNICIAN_RECORD_FAIL_MESSAGE,
  DEFAULT_DELETE_TECHNICIAN_RECORD_SUCCESS_MESSAGE,
  UseDeleteTechnicianRecord,
  useDeleteTechnicianRecord,
} from '@/modules/technician-management/hooks';
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

describe('useDeleteTechnicianRecord', () => {
  const mockUseMutation = jest.fn();
  const mockGqlError = [{ message: 'Simulated GQL error in result' }];
  const mockNetworkError = { message: 'Test network Error' };
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();
  const mockCacheModify = jest.fn();
  const mockDeleteTechnicianRecordResponse = {
    id: mockBenjaminHallRecordId,
    __typename: 'DeleteTechnicianRecordResponse',
  };
  const mockExistingTechnicianRecords = {
    edges: [
      { node: { id: mockBenjaminHallRecordId, name: 'Record 1' } },
      { node: { id: 'test-id-2', name: 'Record 2' } },
    ],
    total: 2,
  };

  beforeEach(() => {
    (useMutationResultToasts as jest.Mock).mockReturnValue({ onSuccess: mockOnSuccess, onError: mockOnError });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (mocks: MockedResponse[] = []): RenderHookResult<unknown, UseDeleteTechnicianRecord> => {
    const cache = new InMemoryCache({
      addTypename: false,
      typePolicies,
    });

    return renderHook(() => useDeleteTechnicianRecord(), {
      wrapper: ({ children }) => (
        <MockProviderHook cache={cache} mocks={mocks}>
          {children}
        </MockProviderHook>
      ),
    });
  };

  it('should return correct initial data', () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: { deleteTechnicianRecord: mockDeleteTechnicianRecordResponse } }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockDeleteTechnicianRecord]);

    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBeFalsy();
  });

  it('should trigger onDeleteTechnicianRecord with success if mutation succeeds without errors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: { deleteElevatorRecord: mockDeleteTechnicianRecordResponse } }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockDeleteTechnicianRecord]);

    await act(async () => {
      await result.current.onDeleteTechnicianRecord(mockBenjaminHallRecordId);
    });

    expect(mockOnSuccess).toHaveBeenCalledWith(DEFAULT_DELETE_TECHNICIAN_RECORD_SUCCESS_MESSAGE);
    expect(onHandleMutationErrors).not.toHaveBeenCalled();
  });

  it('should update cache when mutation is successful and Technician Record is being deleted', async () => {
    mockUseMutation.mockImplementationOnce((_, options) => {
      options?.update(
        {
          modify: mockCacheModify,
        },
        { data: { deleteTechnicianRecord: mockDeleteTechnicianRecordResponse } }
      );

      return [
        jest.fn().mockResolvedValue({ data: { deleteTechnicianRecord: mockDeleteTechnicianRecordResponse } }),
        { loading: false },
      ];
    });

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockDeleteTechnicianRecord]);

    await act(async () => {
      await result.current.onDeleteTechnicianRecord(mockBenjaminHallRecordId);
    });

    expect(mockCacheModify).toHaveBeenCalledWith({
      fields: {
        getTechnicianRecords: expect.any(Function),
      },
    });

    const { getTechnicianRecords: customModifyFn } = mockCacheModify.mock.calls[0][0].fields;

    const modifiedTechnicianRecords = customModifyFn(mockExistingTechnicianRecords);

    const updatedTechnicianRecordsResult = { edges: [{ node: { id: 'test-id-2', name: 'Record 2' } }], total: 1 };

    expect(modifiedTechnicianRecords).toEqual(updatedTechnicianRecordsResult);
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

    const { result } = hook([mockDeleteTechnicianRecord]);

    await act(async () => {
      await result.current.onDeleteTechnicianRecord(mockBenjaminHallRecordId);
    });

    expect(mockCacheModify).not.toHaveBeenCalled();
  });

  it('should handle GraphQL errors and trigger onHandleMutationErrors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({
        data: { deleteElevatorRecord: mockDeleteTechnicianRecordResponse },
        errors: mockGqlError,
      }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockDeleteTechnicianRecordGQLError]);

    await act(async () => {
      await result.current.onDeleteTechnicianRecord(mockBenjaminHallRecordId);
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(onHandleMutationErrors).toHaveBeenCalledWith({
      errors: [{ message: 'Simulated GQL error in result' }],
      message: DEFAULT_DELETE_TECHNICIAN_RECORD_FAIL_MESSAGE,
      onFailure: expect.any(Function),
    });
  });

  it('should handle network error and call onHandleMutationErrors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockRejectedValue(new Error('Network Error')),
      { loading: false, error: mockNetworkError },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockDeleteTechnicianRecordNetworkError]);

    await act(async () => {
      await result.current.onDeleteTechnicianRecord(mockBenjaminHallRecordId);
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(onHandleMutationErrors).toHaveBeenCalledWith({
      error: expect.objectContaining({ message: 'Network Error' }),
      message: DEFAULT_DELETE_TECHNICIAN_RECORD_FAIL_MESSAGE,
      onFailure: expect.any(Function),
    });
  });
});
