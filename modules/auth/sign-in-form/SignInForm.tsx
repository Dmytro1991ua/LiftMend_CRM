import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { FormProvider, SubmitHandler } from 'react-hook-form';

import AuthFormSeparator from '@/shared/auth/auth-form-separator';
import { useAuthMutation } from '@/shared/auth/hooks';
import ThirdPartyAuthButton from '@/shared/auth/third-party-auth-button';
import { useFormState } from '@/shared/hooks';
import { AppRoutes } from '@/types/enums';

import AuthForm from '../auth-form';
import { AuthButtonLabel, AuthFormType } from '../types';
import { INITIAL_SIGN_IN_FORM_VALUES, SignInFormFields, signInSchema } from '../validation';

const SignInForm = () => {
  const { formState, onReset } = useFormState<SignInFormFields>({
    initialValues: INITIAL_SIGN_IN_FORM_VALUES,
    resolver: zodResolver(signInSchema),
  });

  const router = useRouter();

  const { onAuthMutation, isLoading } = useAuthMutation({
    action: 'LOGIN',
    onRedirect: () => router.push(AppRoutes.Dashboard),
    onReset,
  });

  const onSubmit: SubmitHandler<SignInFormFields> = async (data) => {
    await onAuthMutation({
      input: {
        email: data.email,
        password: data.password,
      },
    });
  };

  return (
    <FormProvider {...formState}>
      <AuthForm
        authFormSeparator={<AuthFormSeparator />}
        buttonLabel={AuthButtonLabel.LOGIN}
        formType={AuthFormType.SIGN_IN}
        isLoading={isLoading}
        oAuthButtons={<ThirdPartyAuthButton />}
        onSubmit={formState.handleSubmit(onSubmit)}
      />
    </FormProvider>
  );
};

export default SignInForm;
