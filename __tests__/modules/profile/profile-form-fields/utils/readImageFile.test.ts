import {
  DEFAULT_MAX_FILE_SIZE,
  DEFAULT_MAX_IMAGE_DIMENSION,
  INCOMPATIBLE_FILE_DIMENSION_MESSAGE,
  INCOMPATIBLE_FILE_FORMAT_MESSAGE,
  INCOMPATIBLE_FILE_SIZE_MESSAGE,
} from '@/modules/profile/constants';
import { readImageFile } from '@/modules/profile/utils';

describe('readImageFile', () => {
  const mockFile: File = new File(['dummy file'], 'image.png', {
    type: 'image/png',
  });

  let originalCreateObjectURL: typeof URL.createObjectURL;

  beforeEach(() => {
    originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = jest.fn().mockReturnValue('mock-url');
  });

  afterEach(() => {
    URL.createObjectURL = originalCreateObjectURL;
  });

  it('should resolve with the result when given a file', async () => {
    const expectedResult = 'data:image/png;base64,ABC123';

    const mockFileReader = {
      onload: null,
      onerror: jest.fn(),
      readAsDataURL: jest.fn(),
      result: expectedResult,
    };

    window.FileReader = jest.fn(() => mockFileReader);

    const resultPromise = readImageFile([mockFile]);

    setTimeout(() => {
      mockFileReader.onload();
    }, 100);

    resultPromise.then((result) => {
      expect(result).toEqual(expectedResult);
      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(mockFile);
    });
  });

  it('should resolve with the result when given a valid image file with compatible dimensions', async () => {
    const expectedResult = 'data:image/png;base64,ABC123';

    const mockFileReader = {
      onload: jest.fn(),
      onerror: jest.fn(),
      readAsDataURL: jest.fn(),
      result: expectedResult,
    };

    const mockImage = {
      src: '',
      onload: jest.fn(),
      onerror: jest.fn(),
      naturalWidth: DEFAULT_MAX_IMAGE_DIMENSION.width,
      naturalHeight: DEFAULT_MAX_IMAGE_DIMENSION.height,
    };

    window.FileReader = jest.fn(() => mockFileReader);
    window.Image = jest.fn(() => mockImage);

    const resultPromise = readImageFile([mockFile]);

    setTimeout(() => {
      mockFileReader.onload();
      mockImage.onload();
    }, 100);

    resultPromise.then((result) => {
      expect(result).toEqual(expectedResult);
      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(mockFile);
      expect(mockFileReader.onload).toHaveBeenCalled();
      expect(mockImage.src).toEqual(expect.stringContaining(mockFile.name));
      expect(mockImage.onload).toHaveBeenCalled();
    });
  });

  it('should reject with an error when given an incompatible file format', async () => {
    const mockFileReader = {
      onload: jest.fn(),
      onerror: jest.fn(),
      readAsDataURL: jest.fn(),
    };

    window.FileReader = jest.fn(() => mockFileReader);

    const invalidFile = new File(['dummy file'], 'image.txt', {
      type: 'text/plain',
    });

    await expect(readImageFile([invalidFile])).rejects.toThrowError(INCOMPATIBLE_FILE_FORMAT_MESSAGE);
  });

  it('should reject with an error when given a valid image file with incompatible dimensions', async () => {
    const invalidFile = new File(['dummy file'], 'image.png', {
      type: 'image/png',
    });

    const mockFileReader = {
      onload: jest.fn(),
      onerror: jest.fn(),
      readAsDataURL: jest.fn(),
      result: 'data:image/png;base64,ABC123',
    };

    const mockImage = {
      src: '',
      onload: jest.fn(),
      onerror: jest.fn(),
      naturalWidth: 200,
      naturalHeight: 300,
    };

    window.FileReader = jest.fn(() => mockFileReader);
    window.Image = jest.fn(() => mockImage);

    const resultPromise = readImageFile([invalidFile]);

    setTimeout(() => {
      mockFileReader.onload();
      mockImage.onload();
    }, 100);

    await expect(resultPromise).rejects.toThrowError(INCOMPATIBLE_FILE_DIMENSION_MESSAGE);
    expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(invalidFile);
  });

  it('should reject with an error when given a file with size exceeding the maximum allowed size', async () => {
    const largeFile = new File(['dummy file'], 'image.png', {
      type: 'image/png',
    });

    Object.defineProperty(largeFile, 'size', {
      value: DEFAULT_MAX_FILE_SIZE + 1,
    });

    const mockFileReader = {
      onload: null,
      onerror: jest.fn(),
      readAsDataURL: jest.fn(function () {
        setTimeout(() => {
          if (this.onload) {
            this.onload();
          }
        }, 100);
      }),
      result: 'data:image/png;base64,ABC123',
    };

    window.FileReader = jest.fn(() => mockFileReader);

    const resultPromise = readImageFile([largeFile]);

    setTimeout(() => {
      expect(mockFileReader.readAsDataURL).toHaveBeenCalledTimes(1);
      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(largeFile);
    }, 200);

    await expect(resultPromise).rejects.toThrowError(INCOMPATIBLE_FILE_SIZE_MESSAGE);
  });
});
