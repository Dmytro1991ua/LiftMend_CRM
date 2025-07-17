import { InMemoryCache, useMutation } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';

import { typePolicies } from '@/graphql/typePolicies';
import { mockRepairJob } from '@/mocks/repairJobScheduling';
import {
  mockReassignTechnician,
  mockReassignTechnicianGQLError,
  mockReassignTechnicianNetworkError,
} from '@/mocks/repairJobTrackingMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
import { UseReassignTechnician, useReassignTechnician } from '@/shared/repair-job/hooks/useReassignTechnician';
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

describe('useReassignTechnician', () => {
  const mockUseMutation = jest.fn();
  const mockGqlError = [{ message: 'Simulated GQL error in result' }];
  const mockNetworkError = { message: 'Test network Error' };
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();
  const mockUpdatedTechnicianName = 'Mike Smith';
  const mockFormFields = {
    technicianName: mockUpdatedTechnicianName,
  };
  const mockUpdatedRepairJob = {
    ...mockRepairJob,
    technicianName: mockUpdatedTechnicianName,
  };

  beforeEach(() => {
    (useMutationResultToasts as jest.Mock).mockReturnValue({ onSuccess: mockOnSuccess, onError: mockOnError });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (mocks: MockedResponse[] = []): RenderHookResult<unknown, UseReassignTechnician> => {
    const cache = new InMemoryCache({
      addTypename: false,
      typePolicies,
    });

    return renderHook(() => useReassignTechnician(), {
      wrapper: ({ children }) => (
        <MockProviderHook cache={cache} mocks={mocks}>
          {children}
        </MockProviderHook>
      ),
    });
  };

  it('should return correct initial data', () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: { reassignTechnician: mockUpdatedRepairJob } }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockReassignTechnician]);

    expect(result.current.isLoading).toBeFalsy();
  });

  it('should trigger onReassignTechnician with success when the mutation succeeds without errors.', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: { reassignTechnician: mockUpdatedRepairJob } }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockReassignTechnician]);

    await act(async () => {
      await result.current.onReassignTechnician(mockFormFields, { ...mockRepairJob, status: 'In Progress' });
    });

    expect(mockOnSuccess).toHaveBeenCalledWith('Successfully Reassign Emergency Repair Job to Mike Smith');
    expect(onHandleMutationErrors).not.toHaveBeenCalledWith();
  });

  it('should handle GraphQL errors and trigger onHandleMutationErrors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: undefined, errors: mockGqlError }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockReassignTechnicianGQLError]);

    await act(async () => {
      await result.current.onReassignTechnician(mockFormFields, { ...mockRepairJob, status: 'In Progress' });
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(onHandleMutationErrors).toHaveBeenCalledWith({
      errors: [{ message: 'Simulated GQL error in result' }],
      message: 'Fail to Reassign Chloe Carter to Mike Smith',
      onFailure: expect.any(Function),
    });
  });

  it('should handle network error and call onHandleMutationErrors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockRejectedValue({ message: 'Network Error' }),
      { loading: false, error: mockNetworkError },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockReassignTechnicianNetworkError]);

    await act(async () => {
      await result.current.onReassignTechnician(mockFormFields, { ...mockRepairJob, status: 'In Progress' });
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(onHandleMutationErrors).toHaveBeenCalledWith({
      error: expect.objectContaining({ message: 'Network Error' }),
      message: 'Reassign Technician Fail',
      onFailure: expect.any(Function),
    });
  });
});
