import { useCallback, useEffect, useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormProvider, SubmitHandler } from 'react-hook-form';

import { usePhoneCountry } from '@/shared/base-input/phone-number-input/hooks/usePhoneCountry';
import useFormState from '@/shared/hooks/useFormState';
import { useGetUser } from '@/shared/hooks/useGetUser';
import SectionHeader from '@/shared/section-header';
import { formatPhoneNumber } from '@/shared/utils';
import { SectionHeaderTitle } from '@/types/enums';

import { PROFILE_CHANGE_PASSWORD_SETTINGS_CONFIG } from './configs';
import ProfileAccountSettings from './profile-account-settings';
import ProfileContentWrapper from './profile-account-settings/profile-content-wrapper';
import ProfileActionButtons from './profile-action-buttons/ProfileActionButtons';
import ProfileFormFields from './profile-form-fields';
import { ProfileContentConfig, ProfileContentSubtitle, ProfileContentTitle } from './types';
import { convertProfileDataToFormValues } from './utils';
import { ProfileContentFormFields, profileFormSchema } from './validation';

const Profile = (): React.JSX.Element => {
  const { user, loading, refetch } = useGetUser();

  const currentUserData = useMemo(() => convertProfileDataToFormValues(user), [user]);

  const { formState, onReset } = useFormState<ProfileContentFormFields>({
    initialValues: currentUserData,
    resolver: zodResolver(profileFormSchema),
    shouldFocusError: false,
  });

  const { selectedCountry, onSelectCountry, onResetPhoneInputCountry } = usePhoneCountry();

  //  React Hook Form only sets initial values on mount.
  // When user data loads asynchronously, this effect resets the form with updated values.
  useEffect(() => {
    if (user) {
      formState.reset(currentUserData);
    }
  }, [user, currentUserData, formState]);

  const onDiscardChanges = useCallback(() => {
    onReset();
    onResetPhoneInputCountry();
  }, [onReset, onResetPhoneInputCountry]);

  const onSubmit: SubmitHandler<ProfileContentFormFields> = async (data) => {
    const finalData = {
      ...data,
      phoneNumber: formatPhoneNumber(data.phoneNumber),
    };

    console.log('Final Submitted Data:', finalData);

    onDiscardChanges();
  };

  const PROFILE_CONTENT_CONFIG: ProfileContentConfig[] = [
    {
      id: 1,
      title: ProfileContentTitle.AccountSettings,
      subtitle: ProfileContentSubtitle.UserInformation,
      component: (
        <ProfileAccountSettings
          isLoading={loading}
          refetch={refetch}
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
