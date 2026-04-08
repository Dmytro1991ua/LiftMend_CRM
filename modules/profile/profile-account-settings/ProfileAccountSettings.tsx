import { useMemo } from 'react';

import { useDropzone } from 'react-dropzone';
import { Bars } from 'react-loader-spinner';

import { GetUserQuery } from '@/graphql/types/client/generated_types';
import { cn } from '@/lib/utils';
import { ACCEPTABLE_FILE_IMAGE_TYPES } from '@/shared/hooks/useSingleImageUpload/constants';
import UserAvatar from '@/shared/user-avatar';

import { getProfileAccountSettingsConfig } from '../configs';
import { useUpdateProfilePicture } from '../hooks';
import ProfileDropzone from '../profile-dropzone';
import ProfileFormFields from '../profile-form-fields';

export type ProfileAccountSettingsProps = {
  user: GetUserQuery['getUser'] | null;
  isLoading: boolean;
  selectedCountry?: string;
  onSelectCountry?: (country: string) => void;
};

const ProfileAccountSettings = ({ user, isLoading, selectedCountry, onSelectCountry }: ProfileAccountSettingsProps) => {
  const { loading: uploadFileLoading, previewImage, onImageUpload } = useUpdateProfilePicture();

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onImageUpload,
    multiple: false,
    accept: ACCEPTABLE_FILE_IMAGE_TYPES,
  });

  const profileAccountSettingsConfig = useMemo(() => getProfileAccountSettingsConfig(user), [user]);

  return (
    <div className={cn('flex flex-col items-center justify-center gap-2 xl:gap-6 lg:flex-row lg:items-start')}>
      {isLoading ? (
        <Bars
          ariaLabel='bars-loading'
          color='#2563eb'
          height='100'
          visible={true}
          width='100'
          wrapperClass=' h-[30rem] items-center'
        />
      ) : (
        <>
          <ProfileDropzone getInputProps={getInputProps} getRootProps={getRootProps}>
            <UserAvatar
              className='h-22 w-22 md:h-60 md:w-60'
              imageHeight={150}
              imageSrc={user?.avatarUrl ?? ''}
              imageWidth={150}
              isLoading={isLoading || uploadFileLoading}
              previewImage={previewImage}
            />
          </ProfileDropzone>
          <ProfileFormFields
            config={profileAccountSettingsConfig}
            selectedCountry={selectedCountry}
            onSelectCountry={onSelectCountry}
          />
        </>
      )}
    </div>
  );
};

export default ProfileAccountSettings;
