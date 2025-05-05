import {
  ALLOWED_IMAGE_FORMATS,
  DEFAULT_MAX_FILE_SIZE,
  DEFAULT_MAX_IMAGE_DIMENSION,
  INCOMPATIBLE_FILE_DIMENSION_MESSAGE,
  INCOMPATIBLE_FILE_FORMAT_MESSAGE,
  INCOMPATIBLE_FILE_SIZE_MESSAGE,
} from '../constants';
import { validateImageDimensions } from '../utils';

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
