import { useCallback, useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormProvider, SubmitHandler } from 'react-hook-form';

import useFormState from '@/shared/hooks/useFormState';
import { useGetUser } from '@/shared/hooks/useGetUser';
import SectionHeader from '@/shared/section-header';
import { SectionHeaderTitle } from '@/types/enums';

import { PROFILE_CHANGE_PASSWORD_SETTINGS_CONFIG } from './configs';
import ProfileAccountSettings from './profile-account-settings';
import ProfileContentWrapper from './profile-account-settings/profile-content-wrapper';
import { convertProfileDataToFormValues } from './utils';
import { ProfileContentFormFields, profileFormSchema } from './validation';
import { ProfileContentConfig, ProfileContentSubtitle, ProfileContentTitle } from './types';
import ProfileFormFields from './profile-form-fields';
import ProfileActionButtons from './profile-action-buttons/ProfileActionButtons';

const Profile = (): React.JSX.Element => {
  const { user, loading, refetch } = useGetUser();

  const currentUserData = useMemo(() => convertProfileDataToFormValues(user), [user]);

  const { formState, onReset } = useFormState<ProfileContentFormFields>({
    initialValues: currentUserData,
    resolver: zodResolver(profileFormSchema),
    shouldFocusError: false,
  });

  const onDiscardChanges = useCallback(() => {
    onReset();
  }, [onReset]);

  const onSubmit: SubmitHandler<ProfileContentFormFields> = async (data) => {
    console.log('Final Submitted Data:', data);

    onDiscardChanges();
  };

  const PROFILE_CONTENT_CONFIG: ProfileContentConfig[] = [
    {
      id: 1,
      title: ProfileContentTitle.AccountSettings,
      subtitle: ProfileContentSubtitle.UserInformation,
      component: <ProfileAccountSettings isLoading={loading} refetch={refetch} user={user} />,
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
      <Form>
        <SectionHeader
          actionComponent={
            <ProfileActionButtons
              isDisabled={!formState.formState.isDirty}
              onReset={onDiscardChanges}
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
