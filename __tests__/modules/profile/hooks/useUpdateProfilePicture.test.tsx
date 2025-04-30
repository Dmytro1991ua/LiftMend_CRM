import { InMemoryCache, useMutation } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { act } from '@testing-library/react';
import { RenderHookResult, renderHook } from '@testing-library/react-hooks';

import { typePolicies } from '@/graphql/typePolicies';
import {
  mockUpdateProfilePictureGQLErrorResponse,
  mockUpdateProfilePictureNetworkErrorResponse,
  mockUpdateProfilePictureResponse,
  mockUploadFile,
  mockUploadProfilePicture,
} from '@/mocks/profileMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import { mockUser } from '@/mocks/userMocks';
import { UseUpdateProfilePicture, useUpdateProfilePicture } from '@/modules/profile/hooks';
import { handleImageDrop } from '@/modules/profile/utils';
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

jest.mock('@/modules/profile/utils', () => ({
  ...jest.requireActual('@/modules/profile/utils'),
  handleImageDrop: jest.fn(),
}));

jest.mock('@/shared/utils', () => ({
  ...jest.requireActual('@/shared/utils'),
  onHandleMutationErrors: jest.fn(),
}));

describe('useUpdateProfilePicture', () => {
  const mockUseMutation = jest.fn();
  const mockGqlError = [{ message: 'Simulated GQL error in result' }];
  const mockNetworkError = { message: 'Test network Error' };
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();
  const mockCacheModify = jest.fn();
  const mockCacheIdentify = jest.fn().mockReturnValue('AppUser:test-user-id-1');
  const mockUpdatedProfilePictureResponse = {
    id: 'test-user-id-1',
    avatarUrl: 'https://example.com/avatar.jpg',
    __typename: 'UploadProfilePicturePayload',
  };

  beforeEach(() => {
    (useMutationResultToasts as jest.Mock).mockReturnValue({ onSuccess: mockOnSuccess, onError: mockOnError });

    (handleImageDrop as jest.Mock).mockReturnValue(mockUploadFile);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (mocks: MockedResponse[] = []): RenderHookResult<unknown, UseUpdateProfilePicture> => {
    const cache = new InMemoryCache({
      addTypename: false,
      typePolicies,
    });

    return renderHook(() => useUpdateProfilePicture(), {
      wrapper: ({ children }) => (
        <MockProviderHook cache={cache} mocks={mocks}>
          {children}
        </MockProviderHook>
      ),
    });
  };

  it('should return correct hook initial data', () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: { uploadProfilePicture: mockUploadProfilePicture } }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockUpdateProfilePictureResponse]);

    expect(result.current.loading).toBe(false);
    expect(result.current.previewImage).toBeNull();
  });

  it('should trigger onImageUpload with success when the mutation succeeds without errors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: { uploadProfilePicture: mockUploadProfilePicture } }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockUpdateProfilePictureResponse]);

    await act(async () => await result.current.onImageUpload([mockUploadFile as unknown as File]));

    expect(mockOnSuccess).toHaveBeenCalledWith('Successfully uploaded profile picture');
    expect(onHandleMutationErrors).not.toHaveBeenCalledWith();
  });

  it('should update cache when mutation is successful and Elevator Record is being deleted', async () => {
    mockUseMutation.mockImplementationOnce((_, options) => {
      options?.update(
        {
          modify: mockCacheModify,
          identify: mockCacheIdentify,
        },
        { data: { uploadProfilePicture: mockUpdatedProfilePictureResponse } }
      );

      return [
        jest.fn().mockResolvedValue({ data: { uploadProfilePicture: mockUpdatedProfilePictureResponse } }),
        { loading: false },
      ];
    });

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockUpdateProfilePictureResponse]);

    await act(async () => await result.current.onImageUpload([mockUploadFile as unknown as File]));

    expect(mockCacheModify).toHaveBeenCalledWith({
      id: 'AppUser:test-user-id-1',
      fields: {
        avatarUrl: expect.any(Function),
      },
    });

    const { avatarUrl: customModifyFn } = mockCacheModify.mock.calls[0][0].fields;

    const modifiedProfilePicture = customModifyFn(mockUser);

    expect(modifiedProfilePicture).toEqual('https://example.com/avatar.jpg');
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

    const { result } = hook([mockUpdateProfilePictureResponse]);

    await act(async () => await result.current.onImageUpload([mockUploadFile as unknown as File]));

    expect(mockCacheModify).not.toHaveBeenCalled();
  });

  it('should handle GraphQL errors and trigger onHandleMutationErrors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockResolvedValue({ data: undefined, errors: mockGqlError }),
      { loading: false, error: undefined },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockUpdateProfilePictureGQLErrorResponse]);

    await act(async () => await result.current.onImageUpload([mockUploadFile as unknown as File]));

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(onHandleMutationErrors).toHaveBeenCalledWith({
      errors: [{ message: 'Simulated GQL error in result' }],
      message: 'Fail to uploaded profile picture',
      onFailure: expect.any(Function),
    });
  });

  it('should handle network error and call onHandleMutationErrors', async () => {
    mockUseMutation.mockReturnValue([
      jest.fn().mockRejectedValue(new Error('Network Error')),
      { loading: false, error: mockNetworkError },
    ]);

    (useMutation as jest.Mock).mockImplementation(mockUseMutation);

    const { result } = hook([mockUpdateProfilePictureNetworkErrorResponse]);

    await act(async () => await result.current.onImageUpload([mockUploadFile as unknown as File]));

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(onHandleMutationErrors).toHaveBeenCalledWith({
      error: expect.objectContaining({ message: 'Network Error' }),
      message: 'Upload Profile Picture Failed',
      onFailure: expect.any(Function),
    });
  });
});
