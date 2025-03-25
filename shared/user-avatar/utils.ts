import { BLURRED_IMAGE } from '../constants';

type AvatarImagesProps = {
  isLoading?: boolean;
  previewImage?: string | null;
  imageSrc?: string;
};

type AvatarImages = {
  displayedImage: string;
  fallbackImage: string;
};

/**
 * Helper to determine which image to display and which fallback to use.
 *
 * When isLoading is true, both images are the blurred image.
 * Otherwise, it uses previewImage if available; if not, then imageSrc,
 * and falls back to BLURRED_IMAGE or '/user.png' if imageSrc is empty.
 */

export const getAvatarImages = ({ isLoading, previewImage, imageSrc }: AvatarImagesProps): AvatarImages => {
  if (isLoading) {
    return { displayedImage: BLURRED_IMAGE, fallbackImage: BLURRED_IMAGE };
  }

  const hasValidImageSrc = imageSrc && imageSrc.trim() !== '';

  const displayedImage = previewImage ?? (hasValidImageSrc ? imageSrc! : BLURRED_IMAGE);
  const fallbackImage = hasValidImageSrc ? BLURRED_IMAGE : '/user.png';

  return { displayedImage, fallbackImage };
};
