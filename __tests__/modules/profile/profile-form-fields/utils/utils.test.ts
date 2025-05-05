import { validateImageDimensions } from '@/modules/profile/utils';

jest.mock('react-image-file-resizer', () => ({
  imageFileResizer: jest.fn(),
}));

describe('validateImageDimensions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const image = document.createElement('img');
  const maxWidth = 1000;
  const maxHeight = 800;

  it('should return true when image dimensions are within the specified limits', () => {
    image.width = 800;
    image.height = 600;

    const result = validateImageDimensions(image, maxWidth, maxHeight);

    expect(result).toBe(true);
  });

  it('should return false when when image height exceeds the maximum allowed height', () => {
    image.width = 800;
    image.height = 900;

    const result = validateImageDimensions(image, maxWidth, maxHeight);

    expect(result).toBe(false);
  });

  it('should return false when when image dimensions exceed both the maximum width and height', () => {
    image.width = 1200;
    image.height = 900;

    const result = validateImageDimensions(image, maxWidth, maxHeight);

    expect(result).toBe(false);
  });
});
