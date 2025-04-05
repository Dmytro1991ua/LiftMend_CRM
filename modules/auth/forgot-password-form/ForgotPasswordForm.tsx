import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, SubmitHandler } from 'react-hook-form';

import { useAuthMutation } from '@/shared/auth/hooks';
import useFormState from '@/shared/hooks/useFormState';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
import { AppRoutes } from '@/types/enums';

import AuthForm from '../auth-form';
import { AuthButtonLabel, AuthFormType } from '../types';
import { ForgotPasswordFormFields, INITIAL_FORGOT_PASSWORD_FORM_VALUES, forgotPasswordSchema } from '../validation';

const ForgotPasswordForm = () => {
  const { formState, onReset } = useFormState<ForgotPasswordFormFields>({
    initialValues: INITIAL_FORGOT_PASSWORD_FORM_VALUES,
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { onError, onSuccess } = useMutationResultToasts();

  const { onAuthMutation, isLoading } = useAuthMutation({
    action: 'FORGOT_PASSWORD',
    onError,
    onSuccess,
    onReset,
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormFields> = async (data) => {
    await onAuthMutation({
      input: {
        email: data.email,
        redirectTo: `${window.location.origin}${AppRoutes.ResetPassword}`,
      },
    });
  };

  return (
    <FormProvider {...formState}>
      <AuthForm
        buttonLabel={AuthButtonLabel.FORGOT_PASSWORD}
        formType={AuthFormType.FORGOT_PASSWORD}
        isLoading={isLoading}
        onSubmit={formState.handleSubmit(onSubmit)}
      />
    </FormProvider>
  );
};

export default ForgotPasswordForm;
