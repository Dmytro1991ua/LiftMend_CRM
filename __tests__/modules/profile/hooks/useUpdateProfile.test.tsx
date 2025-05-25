import { InMemoryCache, useMutation } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { RenderHookResult, act, renderHook } from '@testing-library/react-hooks';

import { typePolicies } from '@/graphql/typePolicies';
import {
  mockUpdateProfileGQLErrorResponse,
  mockUpdateProfileNetworkErrorResponse,
  mockUpdateProfileResponse,
  mockUpdatedProfile,
} from '@/mocks/profileMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import { mockUser } from '@/mocks/userMocks';
import { UseUpdateProfileResult, useUpdateProfile } from '@/modules/profile/hooks';
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

describe('useUpdateProfile', () => {
  const mockUseMutation = jest.fn();
  const mockGqlError = [{ message: 'Simulated GQL error in result' }];
  const mockNetworkError = { message: 'Test network Error' };
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();
  const mockCacheModify = jest.fn();
  const mockCacheIdentify = jest.fn().mockReturnValue('AppUser:test-user-id-1');
  const mockUpdatedProfileResponse = {
    ...mockUpdatedProfile,
    __typename: 'AppUser',
  };

  beforeEach(() => {
    (useMutationResultToasts as jest.Mock).mockReturnValue({ onSuccess: mockOnSuccess, onError: mockOnError });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (mocks: MockedResponse[] = []): RenderHookResult<unknown, UseUpdateProfileResult> => {
    const cache = new InMemoryCache({
      addTypename: false,
      typePolicies,
    });

    return renderHook(() => useUpdateProfile(), {
      wrapper: ({ children }) => (
        <MockProviderHook cache={cache} mocks={mocks}>
          {children}
        </MockProviderHook>
      ),
    });
  };

  it('should return correct hook initial data', () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: { updateUserProfile: mockUpdatedProfile } }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockUpdateProfileResponse]);

    expect(result.current.isLoading).toBe(false);
  });

  it('should trigger onUpdateProfile with success when the mutation succeeds without errors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: { updateUserProfile: mockUpdatedProfile } }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockUpdateProfileResponse]);

    await act(
      async () =>
        await result.current.onUpdateProfile({ ...mockUpdatedProfile, phoneNumber: '+380667877777' }, 'test-user-id-1')
    );

    expect(mockOnSuccess).toHaveBeenCalledWith('Profile updated successfully!');
    expect(onHandleMutationErrors).not.toHaveBeenCalledWith();
  });

  it('should update cache when mutation is successful and profile data is updated', async () => {
    mockUseMutation.mockImplementationOnce((_, options) => {
      options?.update(
        {
          modify: mockCacheModify,
          identify: mockCacheIdentify,
        },
        { data: { updateUserProfile: mockUpdatedProfileResponse } }
      );

      return [
        jest.fn().mockResolvedValue({ data: { updateUserProfile: mockUpdatedProfileResponse } }),
        { loading: false },
      ];
    });

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockUpdateProfileResponse]);

    await act(
      async () =>
        await result.current.onUpdateProfile({ ...mockUpdatedProfile, phoneNumber: '+380667877777' }, 'test-user-id-1')
    );

    expect(mockCacheModify).toHaveBeenCalledWith({
      id: 'AppUser:test-user-id-1',
      fields: {
        firstName: expect.any(Function),
        lastName: expect.any(Function),
        phone: expect.any(Function),
      },
    });

    const {
      firstName: firstNameModifyFn,
      lastName: lastNameModifyFn,
      phone: phoneModifyFn,
    } = mockCacheModify.mock.calls[0][0].fields;

    const modifiedFirstName = firstNameModifyFn(mockUser);
    const modifiedLastName = lastNameModifyFn(mockUser);
    const modifiedPhone = phoneModifyFn(mockUser);

    expect(modifiedFirstName).toEqual(mockUpdatedProfile.firstName);
    expect(modifiedLastName).toEqual(mockUpdatedProfile.lastName);
    expect(modifiedPhone).toEqual(mockUpdatedProfile.phone);
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

    const { result } = hook([mockUpdateProfileResponse]);

    await act(
      async () =>
        await result.current.onUpdateProfile({ ...mockUpdatedProfile, phoneNumber: '+380667877777' }, 'test-user-id-1')
    );

    expect(mockCacheModify).not.toHaveBeenCalled();
  });

  it('should handle GraphQL errors and trigger onHandleMutationErrors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: undefined, errors: mockGqlError }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockUpdateProfileGQLErrorResponse]);

    await act(
      async () =>
        await result.current.onUpdateProfile({ ...mockUpdatedProfile, phoneNumber: '+380667877777' }, 'test-user-id-1')
    );

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(onHandleMutationErrors).toHaveBeenCalledWith({
      errors: [{ message: 'Simulated GQL error in result' }],
      message: 'Failed to update profile',
      onFailure: expect.any(Function),
    });
  });

  it('should handle network error and call onHandleMutationErrors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockRejectedValue(new Error('Network Error')),
      { loading: false, error: mockNetworkError },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockUpdateProfileNetworkErrorResponse]);

    await act(
      async () =>
        await result.current.onUpdateProfile({ ...mockUpdatedProfile, phoneNumber: '+380667877777' }, 'test-user-id-1')
    );

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(onHandleMutationErrors).toHaveBeenCalledWith({
      error: expect.objectContaining({ message: 'Network Error' }),
      message: 'Failed to update profile',
      onFailure: expect.any(Function),
    });
  });
});
