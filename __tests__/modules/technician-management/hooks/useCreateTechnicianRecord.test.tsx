import { InMemoryCache, useMutation } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';

import { typePolicies } from '@/graphql/typePolicies';
import { mockCreateNewTechnicianRecordResponse } from '@/mocks/technicianManagementMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import {
  DEFAULT_TECHNICIAN_RECORD_FAIL_MESSAGE,
  DEFAULT_TECHNICIAN_RECORD_SUCCESS_MESSAGE,
} from '@/modules/technician-management/constants';
import { UseCreateTechnicianRecord, useCreateTechnicianRecord } from '@/modules/technician-management/hooks';
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

describe('useCreateTechnicianRecord', () => {
  const mockUseMutation = jest.fn();
  const mockGqlError = [{ message: 'Simulated GQL error in result' }];
  const mockNetworkError = { message: 'Test network Error' };
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();
  const mockWriteQuery = jest.fn();
  const mockReadQuery = jest.fn();
  const mockCacheModify = jest.fn();

  const mockFormValues = {
    basicInformation: {
      fullName: 'Mike White J.',
      contactInformation: 'test2@gmail.com',
      availabilityStatus: 'Available' as const,
      employmentStatus: 'Active' as const,
    },
    skillsAndCertifications: {
      skills: ['Blueprint Reading'],
      certifications: ['Certified Elevator Technician'],
    },
  };

  const mockCreateTechnicianRecordResponse = {
    id: 'test-technician-id-2',
    name: 'Mark Smith J.',
    contactInformation: 'test2@gmail.com',
    skills: ['Customer Service'],
    certifications: ['Certified Elevator Technician'],
    availabilityStatus: 'Available',
    employmentStatus: 'Active',
    lastKnownAvailabilityStatus: null,
    __typename: 'TechnicianRecord',
  };

  const mockExistingTechnicianRecords = {
    edges: [
      {
        __typename: 'TechnicianRecordEdge',
        cursor: 'test-technician-id-3',
        node: {
          __typename: 'TechnicianRecord',
          id: 'test-technician-id-3',
          name: 'Emily Davis',
          contactInformation: 'emily.davis@example.com',
          skills: ['Quality Assurance', 'Problem Solving', 'Technical Documentation'],
          certifications: ['Plumbing Specialist License', 'Rigging and Hoisting Certification'],
          availabilityStatus: 'Available',
          employmentStatus: 'Inactive',
          lastKnownAvailabilityStatus: '',
        },
      },
    ],
    total: 1,
  };

  beforeEach(() => {
    (useMutationResultToasts as jest.Mock).mockReturnValue({ onSuccess: mockOnSuccess, onError: mockOnError });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (mocks: MockedResponse[] = []): RenderHookResult<unknown, UseCreateTechnicianRecord> => {
    const cache = new InMemoryCache({
      addTypename: false,
      typePolicies,
    });

    return renderHook(() => useCreateTechnicianRecord(), {
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
          createTechnicianRecord: {
            ...mockCreateTechnicianRecordResponse,
          },
        },
      }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockCreateNewTechnicianRecordResponse]);

    expect(result.current.isLoading).toBe(false);
  });

  it('should trigger onCreateTechnicianRecord with success when the mutation succeeds without errors.', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({
        data: {
          createTechnicianRecord: {
            ...mockCreateTechnicianRecordResponse,
          },
        },
      }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockCreateNewTechnicianRecordResponse]);

    await act(async () => {
      await result.current.onCreateTechnicianRecord(mockFormValues);
    });

    expect(mockOnSuccess).toHaveBeenCalledWith(DEFAULT_TECHNICIAN_RECORD_SUCCESS_MESSAGE);
    expect(onHandleMutationErrors).not.toHaveBeenCalledWith();
  });

  it('should update cache when mutation is successful and Technician Record is created', async () => {
    mockUseMutation.mockImplementationOnce((_, options) => {
      options?.update(
        {
          modify: mockCacheModify,
        },
        { data: { createTechnicianRecord: mockCreateTechnicianRecordResponse } }
      );

      return [
        jest.fn().mockResolvedValue({ data: { createTechnicianRecord: mockCreateTechnicianRecordResponse } }),
        { loading: false },
      ];
    });

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockCreateNewTechnicianRecordResponse]);

    await act(async () => {
      await result.current.onCreateTechnicianRecord(mockFormValues);
    });

    expect(mockCacheModify).toHaveBeenCalledWith({
      fields: {
        getTechnicianRecords: expect.any(Function),
      },
    });

    const modifyFn = mockCacheModify.mock.calls[0][0].fields.getTechnicianRecords;
    const modifiedResult = modifyFn(mockExistingTechnicianRecords);

    expect(modifiedResult.edges.length).toBe(2);
    expect(modifiedResult.total).toBe(2);
    expect(modifiedResult.edges[0].node.name).toBe('Mark Smith J.');
    expect(modifiedResult.edges[1].node.name).toBe('Emily Davis');
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

    const { result } = hook([mockCreateNewTechnicianRecordResponse]);

    await act(async () => {
      await result.current.onCreateTechnicianRecord(mockFormValues);
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

    const { result } = hook([mockCreateNewTechnicianRecordResponse]);

    await act(async () => {
      await result.current.onCreateTechnicianRecord(mockFormValues);
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(onHandleMutationErrors).toHaveBeenCalledWith({
      errors: [{ message: 'Simulated GQL error in result' }],
      message: DEFAULT_TECHNICIAN_RECORD_FAIL_MESSAGE,
      onFailure: expect.any(Function),
    });
  });

  it('should handle network error and call onHandleMutationErrors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockRejectedValue({ message: 'Network Error' }),
      { loading: false, error: mockNetworkError },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockCreateNewTechnicianRecordResponse]);

    await act(async () => {
      await result.current.onCreateTechnicianRecord(mockFormValues);
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(onHandleMutationErrors).toHaveBeenCalledWith({
      error: expect.objectContaining({ message: 'Network Error' }),
      message: DEFAULT_TECHNICIAN_RECORD_FAIL_MESSAGE,
      onFailure: expect.any(Function),
    });
  });
});
