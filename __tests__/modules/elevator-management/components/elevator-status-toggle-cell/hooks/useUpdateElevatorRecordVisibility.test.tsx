import { InMemoryCache } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';

import {
  mockUpdateElevatorRecord,
  mockUpdateElevatorRecordGQLError,
  mockUpdateElevatorRecordNetworkError,
} from '@/mocks/elevatorManagementMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import {
  UseUpdateElevatorRecordVisibility,
  useUpdateElevatorRecordVisibility,
} from '@/modules/elevator-management/components/elevator-status-toggle-cell/hooks';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
import { onHandleMutationErrors } from '@/shared/utils';

const mockUseMutation = jest.fn();
const mockGqlError = [{ message: 'Simulated GQL error in result' }];
const mockNetworkError = { message: 'Test network Error' };
const mockOnSuccess = jest.fn();
const mockOnError = jest.fn();

jest.mock('@apollo/client', () => {
  const originalModule = jest.requireActual('@apollo/client');

  return {
    ...originalModule,
    useMutation: (): [() => void, { loading: boolean }] => [mockUseMutation, { loading: false }],
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

describe('useUpdateElevatorRecordVisibility', () => {
  (useMutationResultToasts as jest.Mock).mockReturnValue({ onSuccess: mockOnSuccess, onError: mockOnError });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    id: 'test-id-1',
    newStatus: 'Out of Service',
    currentStatus: 'Operational',
  };

  const hook = (mocks: MockedResponse[] = []): RenderHookResult<unknown, UseUpdateElevatorRecordVisibility> => {
    const cache = new InMemoryCache({
      addTypename: false,
    });

    return renderHook(() => useUpdateElevatorRecordVisibility(), {
      wrapper: ({ children }) => (
        <MockProviderHook cache={cache} mocks={mocks}>
          {children}
        </MockProviderHook>
      ),
    });
  };

  it('should return correct initial data', () => {
    const { result } = hook([mockUpdateElevatorRecord]);

    expect(result.current.error).toBeUndefined();
    expect(result.current.loading).toBeFalsy();
  });

  it('should trigger onUpdateElevatorRecordStatus with success if mutation succeeds without errors', async () => {
    mockUseMutation.mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          updateElevatorRecord: {
            id: 'test-id-1',
            status: 'Out of Service',
            lastKnownStatus: 'Operational',
          },
        },
        errors: undefined,
      })
    );

    const { result } = hook([mockUpdateElevatorRecord]);

    await act(async () => {
      await result.current.onUpdateElevatorRecordStatus(defaultProps);
    });

    expect(mockOnSuccess).toHaveBeenCalledWith('Successfully updated elevator record status');
    expect(onHandleMutationErrors).not.toHaveBeenCalled();
  });

  it('should handle GraphQL errors and trigger onHandleMutationErrors', async () => {
    mockUseMutation.mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          updateElevatorRecord: {
            id: 'test-id-1',
            status: 'Out of Service',
            lastKnownStatus: 'Operational',
          },
        },
        errors: mockGqlError,
      })
    );

    const { result } = hook([mockUpdateElevatorRecordGQLError]);

    await act(async () => {
      await result.current.onUpdateElevatorRecordStatus(defaultProps);
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(onHandleMutationErrors).toHaveBeenCalled();
  });

  it('should handle network error and call onHandleMutationErrors', async () => {
    mockUseMutation.mockImplementationOnce((options) => {
      return Promise.reject({
        graphQLErrors: [],
        networkError: mockNetworkError,
        message: 'Test network error message',
        extraInfo: null,
        ...options,
      });
    });

    const { result } = hook([mockUpdateElevatorRecordNetworkError]);

    await act(async () => {
      await result.current.onUpdateElevatorRecordStatus(defaultProps);
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(onHandleMutationErrors).toHaveBeenCalled();
  });
});
