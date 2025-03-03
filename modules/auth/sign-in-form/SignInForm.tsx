import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { FormProvider, SubmitHandler } from 'react-hook-form';

import useFormState from '@/shared/hooks/useFormState';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
import { AppRoutes } from '@/types/enums';

import AuthForm from '../auth-form';
import AuthFormWrapper from '../auth-form-wrapper';
import { useAuthMutation } from '../hooks';
import { AuthButtonLabel, AuthFormType } from '../types';
import { INITIAL_SIGN_IN_FORM_VALUES, SignInFormFields, signInSchema } from '../validation';

const SignInForm = () => {
  const { formState, onReset } = useFormState<SignInFormFields>({
    initialValues: INITIAL_SIGN_IN_FORM_VALUES,
    resolver: zodResolver(signInSchema),
  });

  const router = useRouter();

  const { onError, onSuccess } = useMutationResultToasts();

  const { onAuthMutation, isLoading } = useAuthMutation({
    action: 'LOGIN',
    onError,
    onSuccess,
    onRedirect: () => router.push(AppRoutes.Dashboard),
  });

  const onSubmit: SubmitHandler<SignInFormFields> = async (data) => {
    await onAuthMutation({
      input: {
        email: data.email,
        password: data.password,
      },
    });

    onReset();
  };

  return (
    <AuthFormWrapper>
      <FormProvider {...formState}>
        <AuthForm
          buttonLabel={AuthButtonLabel.LOGIN}
          formType={AuthFormType.SIGN_IN}
          isLoading={isLoading}
          onSubmit={formState.handleSubmit(onSubmit)}
        />
      </FormProvider>
    </AuthFormWrapper>
  );
};

export default SignInForm;
