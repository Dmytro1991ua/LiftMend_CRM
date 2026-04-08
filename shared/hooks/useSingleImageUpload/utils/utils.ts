export const validateImageDimensions = (image: HTMLImageElement, maxWidth: number, maxHeight: number): boolean =>
  image.width <= maxWidth && image.height <= maxHeight;
