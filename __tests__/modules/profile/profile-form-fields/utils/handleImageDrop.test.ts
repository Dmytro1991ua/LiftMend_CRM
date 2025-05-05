import {
  FAILED_TO_READ_FILE_MESSAGE,
  FAILED_TO_RESIZE_FILE_MESSAGE,
  INVALID_IMAGE_ERROR,
  RESIZE_IMAGE_ERROR_MESSAGE,
  UPLOAD_FILE_ERROR,
} from '@/modules/profile/constants';
import { readImageFile, resizeImage } from '@/modules/profile/utils';
import { handleImageDrop } from '@/modules/profile/utils/handleImageDrop';

jest.mock('@/modules/profile/utils/readImageFile', () => ({
  readImageFile: jest.fn(),
}));

jest.mock('@/modules/profile/utils/resizeImage', () => ({
  resizeImage: jest.fn(),
}));

describe('handleImageDrop', () => {
  let originalCreateObjectURL: typeof URL.createObjectURL;

  const mockOnSetPreviewImage = jest.fn();
  const mockOnError = jest.fn();
  const mockFile = new File([], 'image.jpg', { type: 'image/jpeg' });
  const mockResizedFile = 'resized image data';
  const mockReadImageFile = 'base64Image';

  beforeEach(() => {
    originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = jest.fn().mockReturnValue('mock-url');
  });

  afterEach(() => {
    URL.createObjectURL = originalCreateObjectURL;
    jest.clearAllMocks();
  });

  it('should process a valid image file and call onSetPreviewImage with the resized image', async () => {
    (readImageFile as jest.Mock).mockResolvedValue(mockReadImageFile);
    (resizeImage as jest.Mock).mockResolvedValue(mockResizedFile);

    const result = await handleImageDrop({
      files: [mockFile],
      onSetPreviewImage: mockOnSetPreviewImage,
      onError: mockOnError,
    });

    expect(mockOnSetPreviewImage).toHaveBeenCalledWith(mockResizedFile);
    expect(mockOnError).not.toHaveBeenCalled();
    expect(result).toBe(mockFile);
  });

  it('should call onError if resizedImage is null/undefined', async () => {
    (readImageFile as jest.Mock).mockResolvedValue(mockReadImageFile);
    (resizeImage as jest.Mock).mockResolvedValue(undefined);

    const result = await handleImageDrop({
      files: [mockFile],
      onSetPreviewImage: mockOnSetPreviewImage,
      onError: mockOnError,
    });

    expect(mockOnSetPreviewImage).not.toHaveBeenCalled();
    expect(mockOnError).toHaveBeenCalledWith(RESIZE_IMAGE_ERROR_MESSAGE, FAILED_TO_RESIZE_FILE_MESSAGE);
    expect(result).toBeUndefined();
  });

  it('should call onError if base64Image is not a string', async () => {
    (readImageFile as jest.Mock).mockResolvedValue(null);
    (resizeImage as jest.Mock).mockResolvedValue(mockResizedFile);

    const result = await handleImageDrop({
      files: [mockFile],
      onSetPreviewImage: mockOnSetPreviewImage,
      onError: mockOnError,
    });

    expect(mockOnError).toHaveBeenCalledWith(INVALID_IMAGE_ERROR, FAILED_TO_READ_FILE_MESSAGE);
    expect(mockOnSetPreviewImage).toHaveBeenCalledWith(null);
    expect(result).toBe(mockFile);
  });

  it('should call onError when readImageFile throws an error', async () => {
    (readImageFile as jest.Mock).mockRejectedValue(new Error('Network Error occurs'));

    const result = await handleImageDrop({
      files: [mockFile],
      onSetPreviewImage: mockOnSetPreviewImage,
      onError: mockOnError,
    });

    expect(mockOnSetPreviewImage).not.toHaveBeenCalled();
    expect(mockOnError).toHaveBeenCalledWith(UPLOAD_FILE_ERROR, 'Network Error occurs');
    expect(result).toBeUndefined();
  });
});
