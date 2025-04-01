import { ApolloQueryResult } from '@apollo/client';
import { useDropzone } from 'react-dropzone';
import { Bars } from 'react-loader-spinner';

import { GetUserQuery, GetUserQueryVariables } from '@/graphql/types/client/generated_types';
import { cn } from '@/lib/utils';
import UserAvatar from '@/shared/user-avatar';

import { PROFILE_ACCOUNT_SETTINGS_CONFIG } from '../configs';
import { ACCEPTABLE_FILE_IMAGE_TYPES } from '../constants';
import { useProfileAvatarState } from '../hooks';
import ProfileFormFields from '../profile-form-fields';

import ProfileDropzone from './profile-dropzone';

type ProfileAccountSettingsProps = {
  user: GetUserQuery['getUser'] | null;
  refetch: (variables?: Partial<GetUserQueryVariables>) => Promise<ApolloQueryResult<GetUserQuery>>;
  isLoading: boolean;
  selectedCountry?: string;
  onSelectCountry?: (country: string) => void;
};

const ProfileAccountSettings = ({
  user,
  isLoading,
  refetch,
  selectedCountry,
  onSelectCountry,
}: ProfileAccountSettingsProps) => {
  const { loading: uploadFileLoading, previewImage, onImageUpload } = useProfileAvatarState({ refetch });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onImageUpload,
    multiple: false,
    accept: ACCEPTABLE_FILE_IMAGE_TYPES,
  });

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
            config={PROFILE_ACCOUNT_SETTINGS_CONFIG}
            selectedCountry={selectedCountry}
            onSelectCountry={onSelectCountry}
          />
        </>
      )}
    </div>
  );
};

export default ProfileAccountSettings;
