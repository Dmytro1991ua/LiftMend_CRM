import { useDropzone } from 'react-dropzone';

import { useUser } from '@/shared/contexts/UserContext';
import UserAvatar from '@/shared/user-avatar';

import { ACCEPTABLE_FILE_IMAGE_TYPES } from '../constants';
import { useProfileAvatarState } from '../hooks';

import ProfileDropzone from './profile-dropzone';

const ProfileAccountSettings = () => {
  const { user, loading: userLoading, refetch } = useUser();

  const { loading: uploadFileLoading, previewImage, onImageUpload } = useProfileAvatarState({ refetch });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onImageUpload,
    multiple: false,
    accept: ACCEPTABLE_FILE_IMAGE_TYPES,
  });

  return (
    <div className='flex flex-col items-center justify-center gap-2 lg:flex-row'>
      <ProfileDropzone getInputProps={getInputProps} getRootProps={getRootProps}>
        <UserAvatar
          className='h-22 w-22 md:h-60 md:w-60'
          imageHeight={150}
          imageSrc={user?.avatarUrl ?? ''}
          imageWidth={150}
          isLoading={userLoading || uploadFileLoading}
          previewImage={previewImage}
        />
      </ProfileDropzone>
    </div>
  );
};

export default ProfileAccountSettings;
