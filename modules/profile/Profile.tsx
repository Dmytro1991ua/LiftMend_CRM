import { Form, FormProvider } from 'react-hook-form';

import DeleteModal from '@/shared/base-modal/delete-modal';
import SectionHeader from '@/shared/section-header';
import { SectionHeaderTitle } from '@/types/enums';

import { PROFILE_CHANGE_PASSWORD_SETTINGS_CONFIG } from './configs';
import { DEFAULT_DELETE_ACCOUNT_MODAL_DESCRIPTION, DEFAULT_DELETE_ACCOUNT_MODAL_TITLE } from './constants';
import { useProfile } from './hooks';
import ProfileAccountSettings from './profile-account-settings';
import ProfileActionButtons from './profile-action-buttons/ProfileActionButtons';
import ProfileContentWrapper from './profile-content-wrapper';
import ProfileFormFields from './profile-form-fields';
import { ProfileContentConfig, ProfileContentSubtitle, ProfileContentTitle } from './types';

const Profile = (): React.JSX.Element => {
  const {
    formState,
    selectedCountry,
    isDeleteAccountLoading,
    isModalOpen,
    onSelectCountry,
    onSubmit,
    user,
    loading,
    updateProfileLoading,
    onReset,
    onOpenModal,
    onHandleDeleteAccount,
    onCloseModal,
  } = useProfile();

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
              onDeleteAccount={onOpenModal}
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
      <DeleteModal
        description={DEFAULT_DELETE_ACCOUNT_MODAL_DESCRIPTION}
        isDisabled={isDeleteAccountLoading}
        isLoading={isDeleteAccountLoading}
        isOpen={isModalOpen}
        title={DEFAULT_DELETE_ACCOUNT_MODAL_TITLE}
        onClose={onCloseModal}
        onSubmit={onHandleDeleteAccount}
      />
    </FormProvider>
  );
};

export default Profile;
