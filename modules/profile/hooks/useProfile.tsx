import { useCallback, useEffect, useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { SubmitHandler, UseFormReturn, useForm } from 'react-hook-form';

import { AppUser } from '@/graphql/types/client/generated_types';
import { useSignOut } from '@/shared/auth/hooks';
import { usePhoneCountry } from '@/shared/base-input/phone-number-input/hooks';
import { useGetUser, useModal } from '@/shared/hooks';
import { formatPhoneNumber } from '@/shared/utils';
import { AppRoutes } from '@/types/enums';

import { convertProfileDataToFormValues } from '../utils';
import { ProfileContentFormFields, profileFormSchema } from '../validation';

import { useDeleteAccount } from './useDeleteAccount';
import { useUpdateProfile } from './useUpdateProfile';

export type UseProfileResult = {
  formState: UseFormReturn<ProfileContentFormFields>;
  loading: boolean;
  updateProfileLoading: boolean;
  selectedCountry: string;
  user: AppUser | null;
  onReset: () => void;
  onSelectCountry: (country: string) => void;
  onSubmit: SubmitHandler<ProfileContentFormFields>;
  onHandleDeleteAccount: () => Promise<void>;
  isModalOpen: boolean;
  onOpenModal: () => void;
  isDeleteAccountLoading: boolean;
  onCloseModal: () => void;
};

export const useProfile = (): UseProfileResult => {
  const router = useRouter();

  const { user, loading } = useGetUser();
  const { onUpdateProfile, isLoading: updateProfileLoading } = useUpdateProfile();
  const { selectedCountry, onSelectCountry, onResetPhoneInputCountry } = usePhoneCountry();

  const { loading: isDeleteAccountLoading, onDeleteAccount } = useDeleteAccount();
  const { onSignOut } = useSignOut();

  const { isModalOpen, onCloseModal, onOpenModal } = useModal();

  const currentUserData = useMemo(() => convertProfileDataToFormValues(user), [user]);

  const formState = useForm<ProfileContentFormFields>({
    shouldUnregister: false,
    mode: 'onChange',
    defaultValues: currentUserData,
    resolver: zodResolver(profileFormSchema),
  });

  //  React Hook Form only sets initial values on mount.
  // When user data loads asynchronously, this effect resets the form with updated values.
  useEffect(() => {
    if (user) {
      formState.reset(currentUserData);
    }
  }, [user, currentUserData, formState]);

  const onHandleDeleteAccount = useCallback(async () => {
    if (!user?.id) return;

    await onSignOut(AppRoutes.SignUp);

    await onDeleteAccount(user?.id);

    onCloseModal();
  }, [onSignOut, onDeleteAccount, onCloseModal, user?.id]);

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
    onHandleDeleteAccount,
    isModalOpen,
    onOpenModal,
    isDeleteAccountLoading,
    onCloseModal,
  };
};
