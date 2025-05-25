import { InMemoryCache, useMutation } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';

import { typePolicies } from '@/graphql/typePolicies';
import {
  mockBenjaminHallRecord,
  mockUpdateTechnicianRecord,
  mockUpdateTechnicianRecordGQLError,
  mockUpdateTechnicianRecordNetworkError,
  mockUpdatedBenjaminHallRecord,
} from '@/mocks/technicianManagementMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import { UseUpdateTechnicianRecord, useUpdateTechnicianRecord } from '@/modules/technician-management/hooks';
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

describe('useUpdateTechnicianRecord', () => {
  const mockUseMutation = jest.fn();
  const mockGqlError = [{ message: 'Simulated GQL error in result' }];
  const mockNetworkError = { message: 'Test network Error' };
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();
  const mockNewTechnicianRecordEmail = 'benjamin.hall2@example.com';
  const mockFormValues = {
    ...mockBenjaminHallRecord,
    contactInformation: mockNewTechnicianRecordEmail,
  };

  beforeEach(() => {
    (useMutationResultToasts as jest.Mock).mockReturnValue({ onSuccess: mockOnSuccess, onError: mockOnError });

    (getFieldsToUpdateForMutation as jest.Mock).mockReturnValue({
      contactInformation: mockNewTechnicianRecordEmail,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (mocks: MockedResponse[] = []): RenderHookResult<unknown, UseUpdateTechnicianRecord> => {
    const cache = new InMemoryCache({
      addTypename: false,
      typePolicies,
    });

    return renderHook(() => useUpdateTechnicianRecord(), {
      wrapper: ({ children }) => (
        <MockProviderHook cache={cache} mocks={mocks}>
          {children}
        </MockProviderHook>
      ),
    });
  };

  it('should return correct initial data', () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: { updateTechnicianRecord: mockUpdatedBenjaminHallRecord } }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockUpdateTechnicianRecord]);

    expect(result.current.isLoading).toBe(false);
  });

  it('should trigger onUpdateTechnicianRecord with success when the mutation succeeds without errors.', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: { updateTechnicianRecord: mockUpdatedBenjaminHallRecord } }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockUpdateTechnicianRecord]);

    await act(async () => {
      await result.current.onUpdateTechnicianRecord(mockFormValues);
    });

    expect(mockOnSuccess).toHaveBeenCalledWith("Successfully updated Benjamin Hall's record");
    expect(onHandleMutationErrors).not.toHaveBeenCalledWith();
  });

  it('should handle GraphQL errors and trigger onHandleMutationErrors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: undefined, errors: mockGqlError }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockUpdateTechnicianRecordGQLError]);

    await act(async () => {
      await result.current.onUpdateTechnicianRecord(mockFormValues);
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(onHandleMutationErrors).toHaveBeenCalledWith({
      errors: [{ message: 'Simulated GQL error in result' }],
      message: "Fail to update Benjamin Hall's record",
      onFailure: expect.any(Function),
    });
  });

  it('should handle network error and call onHandleMutationErrors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockRejectedValue({ message: 'Network Error' }),
      { loading: false, error: mockNetworkError },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockUpdateTechnicianRecordNetworkError]);

    await act(async () => {
      await result.current.onUpdateTechnicianRecord(mockFormValues);
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(onHandleMutationErrors).toHaveBeenCalledWith({
      error: expect.objectContaining({ message: 'Network Error' }),
      message: 'Update Technician Record Fail',
      onFailure: expect.any(Function),
    });
  });
});
