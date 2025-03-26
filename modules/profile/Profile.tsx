import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormProvider, SubmitHandler } from 'react-hook-form';
import { HiPlus } from 'react-icons/hi';

import { Button } from '@/components/ui/button';
import { useBaseToast } from '@/shared/hooks';
import { BaseToastVariant } from '@/shared/hooks/useBaseToast/types';
import useFormState from '@/shared/hooks/useFormState';
import SectionHeader from '@/shared/section-header';
import { SectionHeaderTitle } from '@/types/enums';

import ProfileAccountSettings from './profile-account-settings';
import ProfileContentWrapper from './profile-account-settings/profile-content-wrapper';
import { ProfileContentSubtitle, ProfileContentTitle } from './types';
import { INITIAL_PROFILE_FORM_VALUES, ProfileFormFields, profileFormSchema } from './validation';

const Profile = (): React.JSX.Element => {
  const { formState, onReset } = useFormState<ProfileFormFields>({
    initialValues: INITIAL_PROFILE_FORM_VALUES,
    resolver: zodResolver(profileFormSchema),
  });

  const { baseToast } = useBaseToast(BaseToastVariant.Info);

  const onSubmit: SubmitHandler<ProfileFormFields> = async (data) => {
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
        <div className='content-wrapper flex justify-center'>
          <ProfileContentWrapper
            subtitle={ProfileContentSubtitle.UserInformation}
            title={ProfileContentTitle.AccountSettings}>
            <ProfileAccountSettings />
          </ProfileContentWrapper>
        </div>
      </Form>
    </FormProvider>
  );
};

export default Profile;
