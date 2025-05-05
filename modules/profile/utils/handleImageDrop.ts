import {
  FAILED_TO_READ_FILE_MESSAGE,
  FAILED_TO_RESIZE_FILE_MESSAGE,
  INVALID_IMAGE_ERROR,
  RESIZE_IMAGE_ERROR_MESSAGE,
  UPLOAD_FILE_ERROR,
} from '../constants';
import { readImageFile, resizeImage } from '../utils';

export const handleImageDrop = async ({
  files,
  onSetPreviewImage,
  onError,
}: {
  files: File[];
  onSetPreviewImage: (value: string | null) => void;
  onError: (message: string, description: string) => void;
}): Promise<File | undefined> => {
  try {
    const file = files[0];

    const base64Image = await readImageFile(files);
    const isValidImage = typeof base64Image === 'string';

    const resizedImage = await resizeImage({ file, width: 500, height: 500 });

    if (!resizedImage) {
      onError(RESIZE_IMAGE_ERROR_MESSAGE, FAILED_TO_RESIZE_FILE_MESSAGE);
      return;
    }

    if (!isValidImage) {
      onError(INVALID_IMAGE_ERROR, FAILED_TO_READ_FILE_MESSAGE);
    }

    onSetPreviewImage(isValidImage ? resizedImage : null);

    return file;
  } catch (error) {
    onError(UPLOAD_FILE_ERROR, (error as Error).message);
  }
};
