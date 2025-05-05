import Resizer from 'react-image-file-resizer';

import { resizeImage } from '@/modules/profile/utils';

jest.mock('react-image-file-resizer', () => ({
  imageFileResizer: jest.fn(),
}));

describe('resizeImage', () => {
  const mockFile = new File(['image data'], 'image.jpg', {
    type: 'image/jpeg',
  });
  const mockResizedFile = 'resized image data';

  beforeEach(() => {
    jest.clearAllMocks();
    (Resizer.imageFileResizer as jest.Mock).mockImplementation(
      (_file, _width, _height, _fileType, _quality, _rotation, callback: (resizedFile: string | null) => void) => {
        callback(mockResizedFile);
      }
    );
  });

  it('should resize the image and return a base64 string', async () => {
    const result = await resizeImage({
      file: mockFile,
      width: 100,
      height: 100,
    });

    expect(Resizer.imageFileResizer).toHaveBeenCalledWith(
      mockFile,
      100,
      100,
      'image/jpeg',
      100,
      0,
      expect.any(Function),
      'base64',
      undefined,
      undefined
    );

    expect(result).toEqual(mockResizedFile);
  });

  it('should return null if the image resizing fails', async () => {
    (Resizer.imageFileResizer as jest.Mock).mockImplementation(
      (_file, _width, _height, _fileType, _quality, _rotation, callback: (resizedFile: string | null) => void) => {
        callback(null);
      }
    );

    const result = await resizeImage({
      file: mockFile,
      width: 100,
      height: 100,
    });

    expect(result).toBeNull();
  });
});
