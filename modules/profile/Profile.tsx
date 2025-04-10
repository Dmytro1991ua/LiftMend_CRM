import { Form, FormProvider } from 'react-hook-form';

import SectionHeader from '@/shared/section-header';
import { SectionHeaderTitle } from '@/types/enums';

import { PROFILE_CHANGE_PASSWORD_SETTINGS_CONFIG } from './configs';
import { useProfile } from './hooks';
import ProfileAccountSettings from './profile-account-settings';
import ProfileContentWrapper from './profile-account-settings/profile-content-wrapper';
import ProfileActionButtons from './profile-action-buttons/ProfileActionButtons';
import ProfileFormFields from './profile-form-fields';
import { ProfileContentConfig, ProfileContentSubtitle, ProfileContentTitle } from './types';

const Profile = (): React.JSX.Element => {
  const { formState, selectedCountry, onSelectCountry, onSubmit, user, loading, updateProfileLoading, onReset } =
    useProfile();

  const PROFILE_CONTENT_CONFIG: ProfileContentConfig[] = [
    {
      id: 1,
      title: ProfileContentTitle.AccountSettings,
      subtitle: ProfileContentSubtitle.UserInformation,
      component: (
        <ProfileAccountSettings
          isLoading={loading}
          selectedCountry={selectedCountry}
          user={user}
          onSelectCountry={onSelectCountry}
        />
      ),
    },
    {
      id: 2,
      title: ProfileContentTitle.ChangePassword,
      subtitle: ProfileContentSubtitle.PasswordManagement,
      component: <ProfileFormFields config={PROFILE_CHANGE_PASSWORD_SETTINGS_CONFIG} />,
    },
  ];

  return (
    <FormProvider {...formState}>
      <Form key={user?.id}>
        <SectionHeader
          actionComponent={
            <ProfileActionButtons
              isDisabled={!formState.formState.isDirty || updateProfileLoading}
              isLoading={updateProfileLoading}
              onReset={onReset}
              onSubmit={formState.handleSubmit(onSubmit)}
            />
          }
          title={SectionHeaderTitle.Profile}
        />
        <div className='content-wrapper flex flex-col gap-2 items-center overflow-y-auto overflow-x-hidden h-[72vh]'>
          {PROFILE_CONTENT_CONFIG.map(({ id, component, title, subtitle }) => (
            <ProfileContentWrapper key={id} subtitle={subtitle} title={title}>
              {component}
            </ProfileContentWrapper>
          ))}
        </div>
      </Form>
    </FormProvider>
  );
};

export default Profile;
