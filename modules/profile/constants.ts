import { Dimensions } from './types';

export const DEFAULT_MAX_FILE_SIZE = 200 * 1024;
export const DEFAULT_MAX_IMAGE_DIMENSION: Dimensions = {
  width: 500,
  height: 500,
};

export const ALLOWED_IMAGE_FORMATS = ['image/png', 'image/jpg', 'image/jpeg'];
export const INCOMPATIBLE_FILE_FORMAT_MESSAGE = 'Invalid file format. Please upload image in PNG/JPG/JPEG formats.';
export const INCOMPATIBLE_FILE_SIZE_MESSAGE = 'File size exceeded. Image must be a maximum of 200kb.';
export const INCOMPATIBLE_FILE_DIMENSION_MESSAGE = `Image dimensions exceed the maximum allowed size of ${DEFAULT_MAX_IMAGE_DIMENSION.width} x ${DEFAULT_MAX_IMAGE_DIMENSION.height}.`;
export const FAILED_TO_READ_FILE_MESSAGE = 'Failed to read the file.';
export const FAILED_TO_RESIZE_FILE_MESSAGE = 'Failed to resize the image.';
export const ACCEPTABLE_FILE_IMAGE_TYPES = { 'image/*': ['.jpg', '.jpeg', '.png'] };
export const RESIZE_IMAGE_ERROR_MESSAGE = 'Error resizing image';
export const INVALID_IMAGE_ERROR = 'Invalid image file';
export const UPLOAD_FILE_ERROR = 'Uploaded file error';

export const UPLOAD_PROFILE_PICTURE_SUCCESS_MESSAGE = 'Successfully uploaded profile picture';
export const UPLOAD_PROFILE_PICTURE_FAILED_GQL_MESSAGE = 'Fail to uploaded profile picture';
export const UPLOAD_PROFILE_PICTURE_FAILED_APOLLO_MESSAGE = 'Upload Profile Picture Failed';

export const PROFILE_DROPZONE_TOOLTIP_MESSAGE = 'Change your avatar';
export const DEFAULT_UPDATE_PROFILE_SUCCESS_MESSAGE = 'Profile updated successfully!';
export const DEFAULT_UPDATE_PROFILE_FAIL_MESSAGE = 'Failed to update profile';

export const DEFAULT_DELETE_ACCOUNT_MODAL_TITLE = 'Delete Account';
export const DEFAULT_DELETE_ACCOUNT_MODAL_DESCRIPTION =
  'Deleting your account is permanent. You will be signed out immediately, and all data associated with your account will be removed. This action cannot be undone.';
