import { useDropzone } from 'react-dropzone';

import { useGetUser } from '@/shared/hooks/useGetUser';
import UserAvatar from '@/shared/user-avatar';

import { ACCEPTABLE_FILE_IMAGE_TYPES } from '../constants';
import { useProfileAvatarState } from '../hooks';

import ProfileDropzone from './profile-dropzone';

const ProfileAccountSettings = () => {
  const { user, loading: userLoading, refetch } = useGetUser();

  const { loading: uploadFileLoading, previewImage, onImageUpload } = useProfileAvatarState({ refetch });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onImageUpload,
    multiple: false,
    accept: ACCEPTABLE_FILE_IMAGE_TYPES,
  });

  return (
    <div>
      <ProfileDropzone getInputProps={getInputProps} getRootProps={getRootProps}>
        <UserAvatar
          className='h-60 w-60'
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
