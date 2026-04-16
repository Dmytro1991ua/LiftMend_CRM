import { act } from '@testing-library/react';
import { RenderHookResult, renderHook } from '@testing-library/react-hooks';

import { UploadProfilePictureMutationVariables } from '@/graphql/types/client/generated_types';
import { mockUploadFile } from '@/mocks/profileMocks';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
import { useSingleImageUpload } from '@/shared/hooks/useSingleImageUpload';
import { UseSingleImageUpload } from '@/shared/hooks/useSingleImageUpload/types';
import { handleImageDrop } from '@/shared/hooks/useSingleImageUpload/utils';
import { onHandleMutationErrors } from '@/shared/utils';

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

jest.mock('@/shared/hooks/useSingleImageUpload/utils', () => ({
  ...jest.requireActual('@/shared/hooks/useSingleImageUpload/utils'),
  handleImageDrop: jest.fn(),
}));

describe('useSingleImageUpload', () => {
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();
  const mockMutationFn = jest.fn();
  const mockGetVariables = jest.fn((file) => ({ file }));
  const mockFile = mockUploadFile as unknown as File;

  const defaultProps = {
    mutationFn: mockMutationFn,
    getVariables: mockGetVariables,
    successMessage: 'Upload successful',
    gqlErrorMessage: 'GQL Error',
    apolloErrorMessage: 'Apollo Error',
  };

  beforeEach(() => {
    (useMutationResultToasts as jest.Mock).mockReturnValue({
      onSuccess: mockOnSuccess,
      onError: mockOnError,
    });

    (handleImageDrop as jest.Mock).mockReturnValue(mockUploadFile);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (): RenderHookResult<unknown, UseSingleImageUpload<{ file: File }>> =>
    renderHook(() => useSingleImageUpload<UploadProfilePictureMutationVariables>(defaultProps));

  it('should return initial hook data', () => {
    const { result } = hook();

    expect(result.current.previewImage).toBeNull();
  });

  it('should successfully upload an image and call onSuccess', async () => {
    mockMutationFn.mockResolvedValue({ data: { upload: { id: '1' } }, errors: [] });

    const { result } = hook();

    await act(async () => {
      await result.current.onFileUpload([mockFile], mockGetVariables);
    });

    expect(handleImageDrop).toHaveBeenCalledWith(expect.objectContaining({ files: [mockUploadFile] }));
    expect(mockMutationFn).toHaveBeenCalledWith({ variables: { file: mockUploadFile } });
    expect(mockOnSuccess).toHaveBeenCalledWith('Upload successful');
  });

  it('should handle GraphQL errors using onHandleMutationErrors', async () => {
    const gqlErrors = [{ message: 'Something went wrong' }];

    mockMutationFn.mockResolvedValue({ errors: gqlErrors });

    const { result } = hook();

    await act(async () => {
      await result.current.onFileUpload([mockFile], mockGetVariables);
    });

    expect(onHandleMutationErrors).toHaveBeenCalledWith({
      message: 'GQL Error',
      errors: gqlErrors,
      onFailure: mockOnError,
    });
  });

  it('should handle server errors)', async () => {
    const error = new Error('Network error');

    mockMutationFn.mockRejectedValue(error);

    const { result } = hook();

    await act(async () => {
      await result.current.onFileUpload([mockFile], mockGetVariables);
    });

    expect(onHandleMutationErrors).toHaveBeenCalledWith({
      message: 'Apollo Error',
      error: error,
      onFailure: mockOnError,
    });
  });

  it('should exit early if handleImageDrop returns null', async () => {
    (handleImageDrop as jest.Mock).mockResolvedValue(null);

    const { result } = hook();

    await act(async () => {
      await result.current.onFileUpload([], mockGetVariables);
    });

    expect(mockMutationFn).not.toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});
