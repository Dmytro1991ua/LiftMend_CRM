import { useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormProvider, SubmitHandler } from 'react-hook-form';
import { HiPlus } from 'react-icons/hi';

import { Button } from '@/components/ui/button';
import { useBaseToast } from '@/shared/hooks';
import { BaseToastVariant } from '@/shared/hooks/useBaseToast/types';
import useFormState from '@/shared/hooks/useFormState';
import { useGetUser } from '@/shared/hooks/useGetUser';
import SectionHeader from '@/shared/section-header';
import { SectionHeaderTitle } from '@/types/enums';

import { PROFILE_CHANGE_PASSWORD_SETTINGS_CONFIG } from './configs';
import ProfileAccountSettings from './profile-account-settings';
import ProfileContentWrapper from './profile-account-settings/profile-content-wrapper';
import ProfileFormFields from './profile-form-fields';
import { ProfileContentSubtitle, ProfileContentTitle } from './types';
import { profileFormSchema } from './validation';
import { convertProfileDataToFormValues } from './utils';
import { ProfileContentFormFields } from './validation';

const Profile = (): React.JSX.Element => {
  const { user, loading, refetch } = useGetUser();

  const currentUserData = useMemo(() => convertProfileDataToFormValues(user), [user]);

  const { formState, onReset } = useFormState<ProfileContentFormFields>({
    initialValues: currentUserData,
    resolver: zodResolver(profileFormSchema),
  });

  const { baseToast } = useBaseToast(BaseToastVariant.Info);

  const onSubmit: SubmitHandler<ProfileContentFormFields> = async (data) => {
    console.log(data);
    onReset();
  };

  //TODO: Example on how to use actionComponent for SectionHeader
  const sectionHeaderButton = (
    <Button
      type='submit'
      onClick={() => {
        formState.handleSubmit(onSubmit)();
        baseToast('Error Occurred', '');
      }}>
      <HiPlus />
      <span className='ml-2'>Add Task</span>
    </Button>
  );

  return (
    <FormProvider {...formState}>
      <Form>
        <SectionHeader actionComponent={sectionHeaderButton} title={SectionHeaderTitle.Profile} />
        <div className='content-wrapper flex flex-col gap-2 items-center overflow-y-auto overflow-x-hidden h-[72vh]'>
          <ProfileContentWrapper
            subtitle={ProfileContentSubtitle.UserInformation}
            title={ProfileContentTitle.AccountSettings}>
            <ProfileAccountSettings isLoading={loading} refetch={refetch} user={user} />
          </ProfileContentWrapper>
          <ProfileContentWrapper
            subtitle={ProfileContentSubtitle.PasswordManagement}
            title={ProfileContentTitle.ChangePassword}>
            <ProfileFormFields config={PROFILE_CHANGE_PASSWORD_SETTINGS_CONFIG} />
          </ProfileContentWrapper>
        </div>
      </Form>
    </FormProvider>
  );
};

export default Profile;
