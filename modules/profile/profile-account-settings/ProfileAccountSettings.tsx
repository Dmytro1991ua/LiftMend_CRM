import { useMemo } from 'react';

import { Bars } from 'react-loader-spinner';

import { GetUserQuery } from '@/graphql/types/client/generated_types';
import { cn } from '@/lib/utils';
import FileDropzone from '@/shared/file-dropzone';
import UserAvatar from '@/shared/user-avatar';

import { getProfileAccountSettingsConfig } from '../configs';
import { PROFILE_DROPZONE_TOOLTIP_MESSAGE } from '../constants';
import { useUpdateProfilePicture } from '../hooks';
import ProfileFormFields from '../profile-form-fields';

export type ProfileAccountSettingsProps = {
  user: GetUserQuery['getUser'] | null;
  isLoading: boolean;
  selectedCountry?: string;
  onSelectCountry?: (country: string) => void;
};

const ProfileAccountSettings = ({ user, isLoading, selectedCountry, onSelectCountry }: ProfileAccountSettingsProps) => {
  const { loading: uploadFileLoading, previewImage, onFileUpload: upload } = useUpdateProfilePicture();

  const profileAccountSettingsConfig = useMemo(() => getProfileAccountSettingsConfig(user), [user]);

  const onFileUpload = (files: File[]) => upload(files, (file) => ({ file }));

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
          <FileDropzone
            isUploadDisabled={uploadFileLoading}
            testId='profile-dropzone'
            tooltip={PROFILE_DROPZONE_TOOLTIP_MESSAGE}
            onFileUpload={onFileUpload}
          >
            <UserAvatar
              className='h-22 w-22 md:h-60 md:w-60'
              imageHeight={150}
              imageSrc={user?.avatarUrl ?? ''}
              imageWidth={150}
              isLoading={isLoading || uploadFileLoading}
              previewImage={previewImage}
            />
          </FileDropzone>
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
