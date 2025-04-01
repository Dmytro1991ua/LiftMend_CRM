import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { FormProvider, SubmitHandler } from 'react-hook-form';

import AuthFormSeparator from '@/shared/auth/auth-form-separator';
import { useAuthMutation } from '@/shared/auth/hooks';
import ThirdPartyAuthButton from '@/shared/auth/third-party-auth-button';
import useFormState from '@/shared/hooks/useFormState';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
import { AppRoutes } from '@/types/enums';

import AuthForm from '../auth-form';
import { AuthButtonLabel, AuthFormType } from '../types';
import { INITIAL_SIGN_UP_FORM_VALUES, SignUpFormFields, signUpSchema } from '../validation';
import { formatPhoneNumber } from '@/shared/utils';
import { usePhoneCountry } from '@/shared/base-input/phone-number-input/hooks';

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
    onReset,
  });

  const { selectedCountry, onSelectCountry, onResetPhoneInputCountry } = usePhoneCountry();

  const onSubmit: SubmitHandler<SignUpFormFields> = async (data) => {
    await onAuthMutation({
      input: {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: formatPhoneNumber(data.phoneNumber),
      },
    });
  };

  return (
    <FormProvider {...formState}>
      <AuthForm
        authFormSeparator={<AuthFormSeparator />}
        buttonLabel={AuthButtonLabel.SIGN_UP}
        formType={AuthFormType.SIGN_UP}
        isLoading={isLoading}
        oAuthButtons={<ThirdPartyAuthButton />}
        onSubmit={formState.handleSubmit(onSubmit)}
        selectedCountry={selectedCountry}
        onSelectCountry={onSelectCountry}
      />
    </FormProvider>
  );
};

export default SignUpForm;
