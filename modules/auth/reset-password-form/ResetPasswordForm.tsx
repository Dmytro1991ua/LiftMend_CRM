import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { FormProvider, SubmitHandler } from 'react-hook-form';

import { useAuthMutation } from '@/shared/auth/hooks';
import useFormState from '@/shared/hooks/useFormState';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
import { AppRoutes } from '@/types/enums';

import AuthForm from '../auth-form';
import { AuthButtonLabel, AuthFormType } from '../types';
import { INITIAL_RESET_PASSWORD_FORM_VALUES, ResetPasswordFormFields, resetPasswordSchema } from '../validation';

const ResetPasswordForm = () => {
  const router = useRouter();

  const { formState, onReset } = useFormState<ResetPasswordFormFields>({
    initialValues: INITIAL_RESET_PASSWORD_FORM_VALUES,
    resolver: zodResolver(resetPasswordSchema),
  });

  const { onError, onSuccess } = useMutationResultToasts();

  const { onAuthMutation, isLoading } = useAuthMutation({
    action: 'RESET_PASSWORD',
    onError,
    onSuccess,
    onReset,
    onRedirect: () => router.push(AppRoutes.Dashboard),
  });

  const onSubmit: SubmitHandler<ResetPasswordFormFields> = async (data) => {
    await onAuthMutation({
      input: {
        password: data.password,
      },
    });
  };

  return (
    <FormProvider {...formState}>
      <AuthForm
        buttonLabel={AuthButtonLabel.RESET_PASSWORD}
        formType={AuthFormType.RESET_PASSWORD}
        isLoading={isLoading}
        onSubmit={formState.handleSubmit(onSubmit)}
      />
    </FormProvider>
  );
};

export default ResetPasswordForm;
