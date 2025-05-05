import Resizer from 'react-image-file-resizer';

import { ResizeImageParams } from '../types';

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
