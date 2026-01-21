import { InMemoryCache, useMutation } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';

import { typePolicies } from '@/graphql/typePolicies';
import {
  mockCompleteElevatorInspectionGQLError,
  mockCompleteElevatorInspectionNetworkError,
  mockCompleteElevatorInspectionResponse,
  mockElevatorId,
} from '@/mocks/elevatorManagementMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import {
  COMPLETE_ELEVATOR_INSPECTION_FAIL_MESSAGE,
  COMPLETE_ELEVATOR_INSPECTION_SUCCESS_MESSAGE,
} from '@/modules/elevator-management/constants';
import { UseCompleteElevatorInspection, useCompleteElevatorInspection } from '@/modules/elevator-management/hooks';
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

describe('useCompleteElevatorInspection', () => {
  const mockUseMutation = jest.fn();
  const mockGqlError = [{ message: 'Simulated GQL error in result' }];
  const mockNetworkError = { message: 'Test network Error' };
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    (useMutationResultToasts as jest.Mock).mockReturnValue({ onSuccess: mockOnSuccess, onError: mockOnError });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (mocks: MockedResponse[] = []): RenderHookResult<unknown, UseCompleteElevatorInspection> => {
    const cache = new InMemoryCache({
      addTypename: false,
      typePolicies,
    });

    return renderHook(() => useCompleteElevatorInspection(), {
      wrapper: ({ children }) => (
        <MockProviderHook cache={cache} mocks={mocks}>
          {children}
        </MockProviderHook>
      ),
    });
  };

  it('should return correct initial data', () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: { updateElevatorRecord: mockCompleteElevatorInspectionResponse } }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockCompleteElevatorInspectionResponse]);

    expect(result.current.isLoading).toBeFalsy();
  });

  it('should trigger onCompleteElevatorInspection with success when the mutation succeeds without errors.', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: { updateElevatorRecord: mockCompleteElevatorInspectionResponse } }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockCompleteElevatorInspectionResponse]);

    await act(async () => {
      await result.current.onCompleteElevatorInspection(mockElevatorId);
    });

    expect(mockOnSuccess).toHaveBeenCalledWith(COMPLETE_ELEVATOR_INSPECTION_SUCCESS_MESSAGE);
    expect(onHandleMutationErrors).not.toHaveBeenCalledWith();
  });

  it('should handle GraphQL errors and trigger onHandleMutationErrors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: undefined, errors: mockGqlError }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockCompleteElevatorInspectionGQLError]);

    await act(async () => {
      await result.current.onCompleteElevatorInspection(mockElevatorId);
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(onHandleMutationErrors).toHaveBeenCalledWith({
      errors: [{ message: 'Simulated GQL error in result' }],
      message: COMPLETE_ELEVATOR_INSPECTION_FAIL_MESSAGE,
      onFailure: expect.any(Function),
    });
  });

  it('should handle network error and call onHandleMutationErrors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockRejectedValue({ message: 'Network Error' }),
      { loading: false, error: mockNetworkError },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockCompleteElevatorInspectionNetworkError]);

    await act(async () => {
      await result.current.onCompleteElevatorInspection(mockElevatorId);
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(onHandleMutationErrors).toHaveBeenCalledWith({
      error: expect.objectContaining({ message: 'Network Error' }),
      message: COMPLETE_ELEVATOR_INSPECTION_FAIL_MESSAGE,
      onFailure: expect.any(Function),
    });
  });
});
