import { useCallback, useEffect, useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, UseFormReturn, useForm } from 'react-hook-form';

import { AppUser } from '@/graphql/types/client/generated_types';
import { usePhoneCountry } from '@/shared/base-input/phone-number-input/hooks';
import { useGetUser } from '@/shared/hooks/useGetUser';
import { formatPhoneNumber } from '@/shared/utils';

import { convertProfileDataToFormValues } from '../utils';
import { ProfileContentFormFields, profileFormSchema } from '../validation';

import { useUpdateProfile } from './useUpdateProfile';

type UseProfileResult = {
  formState: UseFormReturn<ProfileContentFormFields>;
  loading: boolean;
  updateProfileLoading: boolean;
  selectedCountry: string;
  user: AppUser | null;
  onReset: () => void;
  onSelectCountry: (country: string) => void;
  onSubmit: SubmitHandler<ProfileContentFormFields>;
};

export const useProfile = (): UseProfileResult => {
  const { user, loading } = useGetUser();
  const { onUpdateProfile, isLoading: updateProfileLoading } = useUpdateProfile();

  const currentUserData = useMemo(() => convertProfileDataToFormValues(user), [user]);

  const formState = useForm<ProfileContentFormFields>({
    shouldUnregister: false,
    mode: 'onChange',
    defaultValues: currentUserData,
    resolver: zodResolver(profileFormSchema),
  });

  const { selectedCountry, onSelectCountry, onResetPhoneInputCountry } = usePhoneCountry();

  //  React Hook Form only sets initial values on mount.
  // When user data loads asynchronously, this effect resets the form with updated values.
  useEffect(() => {
    if (user) {
      formState.reset(currentUserData);
    }
  }, [user, currentUserData, formState]);

  const onReset = useCallback((): void => {
    formState.reset(currentUserData);
    formState.clearErrors();
  }, [currentUserData, formState]);

  const onSubmit: SubmitHandler<ProfileContentFormFields> = async (data) => {
    const formFields = {
      ...data,
      phoneNumber: formatPhoneNumber(data.phoneNumber),
    };

    await onUpdateProfile(formFields, user?.id);

    onResetPhoneInputCountry();
  };

  return {
    formState,
    onSubmit,
    updateProfileLoading,
    selectedCountry,
    onSelectCountry,
    user,
    loading,
    onReset,
  };
};
