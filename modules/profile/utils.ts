import Resizer from 'react-image-file-resizer';

import { GetUserQuery } from '@/graphql/types/client/generated_types';

import {
  ALLOWED_IMAGE_FORMATS,
  DEFAULT_MAX_FILE_SIZE,
  DEFAULT_MAX_IMAGE_DIMENSION,
  FAILED_TO_READ_FILE_MESSAGE,
  FAILED_TO_RESIZE_FILE_MESSAGE,
  INCOMPATIBLE_FILE_DIMENSION_MESSAGE,
  INCOMPATIBLE_FILE_FORMAT_MESSAGE,
  INCOMPATIBLE_FILE_SIZE_MESSAGE,
  INVALID_IMAGE_ERROR,
  RESIZE_IMAGE_ERROR_MESSAGE,
  UPLOAD_FILE_ERROR,
} from './constants';
import { ResizeImageParams } from './types';
import { ProfileContentFormFields } from './validation';

export const validateImageDimensions = (image: HTMLImageElement, maxWidth: number, maxHeight: number): boolean =>
  image.width <= maxWidth && image.height <= maxHeight;

export const resizeImage = ({
  file,
  width,
  height,
  quality = 100,
  maxWidth,
  maxHeight,
}: ResizeImageParams): Promise<string | null> => {
  return new Promise<string | null>((resolve) => {
    Resizer.imageFileResizer(
      file,
      width,
      height,
      file.type,
      quality,
      0,
      (resizedFile) => {
        const base64String = resizedFile as string;
        resolve(base64String);
      },
      'base64',
      maxWidth,
      maxHeight
    );
  });
};

export const readImageFile = (file: File[]): Promise<string | ArrayBuffer | null> => {
  return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      const img = new Image();

      img.onload = () => {
        if (validateImageDimensions(img, DEFAULT_MAX_IMAGE_DIMENSION.width, DEFAULT_MAX_IMAGE_DIMENSION.height)) {
          resolve(fileReader.result);
        } else {
          reject(new Error(INCOMPATIBLE_FILE_DIMENSION_MESSAGE));
        }
      };

      img.onerror = (error) => {
        reject(error);
      };
      img.src = URL.createObjectURL(file[0]);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };

    if (!file[0] || !ALLOWED_IMAGE_FORMATS.includes(file[0].type)) {
      reject(new Error(INCOMPATIBLE_FILE_FORMAT_MESSAGE));
      return;
    }

    if (file[0].size > DEFAULT_MAX_FILE_SIZE) {
      reject(new Error(INCOMPATIBLE_FILE_SIZE_MESSAGE));
      return;
    }

    fileReader.readAsDataURL(file[0]);
  });
};

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

export const convertProfileDataToFormValues = (user: GetUserQuery['getUser'] | null): ProfileContentFormFields => ({
  email: user ? user.email : '',
  firstName: user ? user.firstName : '',
  lastName: user ? user.lastName : '',
  phoneNumber: user && user?.phone ? user.phone : '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});
