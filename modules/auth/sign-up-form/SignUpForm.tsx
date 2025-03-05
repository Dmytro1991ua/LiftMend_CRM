import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { FormProvider, SubmitHandler } from 'react-hook-form';

import { useAuthMutation } from '@/shared/auth/hooks';
import useFormState from '@/shared/hooks/useFormState';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
import { AppRoutes } from '@/types/enums';

import AuthForm from '../auth-form';
import { AuthButtonLabel, AuthFormType } from '../types';
import { INITIAL_SIGN_UP_FORM_VALUES, SignUpFormFields, signUpSchema } from '../validation';

const SignUpForm = () => {
  const { formState, onReset } = useFormState<SignUpFormFields>({
    initialValues: INITIAL_SIGN_UP_FORM_VALUES,
    resolver: zodResolver(signUpSchema),
  });

  const router = useRouter();

  const { onError, onSuccess } = useMutationResultToasts();

  const { onAuthMutation, isLoading } = useAuthMutation({
    action: 'SIGN_UP',
    onError,
    onSuccess,
    onRedirect: () => router.push(AppRoutes.SignIn),
  });

  const onSubmit: SubmitHandler<SignUpFormFields> = async (data) => {
    await onAuthMutation({
      input: {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phoneNumber,
      },
    });

    onReset();
  };

  return (
    <FormProvider {...formState}>
      <AuthForm
        buttonLabel={AuthButtonLabel.SIGN_UP}
        formType={AuthFormType.SIGN_UP}
        isLoading={isLoading}
        onSubmit={formState.handleSubmit(onSubmit)}
      />
    </FormProvider>
  );
};

export default SignUpForm;
