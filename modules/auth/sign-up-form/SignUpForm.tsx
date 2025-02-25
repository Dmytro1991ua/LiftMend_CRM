import useFormState from '@/shared/hooks/useFormState';
import { INITIAL_SIGN_UP_FORM_VALUES, SignUpFromFields, signUpSchema } from './validation';
import { zodResolver } from '@hookform/resolvers/zod';

import { FormProvider, SubmitHandler } from 'react-hook-form';
import AuthForm from '../auth-form';
import { AuthButtonLabel, AuthFormType } from '../types';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
import { useCreateUser } from '../hooks/useCreateUser';

const SignUpForm = () => {
  const { formState, onReset } = useFormState<SignUpFromFields>({
    initialValues: INITIAL_SIGN_UP_FORM_VALUES,
    resolver: zodResolver(signUpSchema),
  });

  const { onError, onSuccess } = useMutationResultToasts();

  const { onCreateUser, isLoading } = useCreateUser({ onError, onSuccess });

  const onSubmit: SubmitHandler<SignUpFromFields> = async (data) => {
    await onCreateUser(data);

    onReset();
  };

  return (
    <FormProvider {...formState}>
      <AuthForm
        onSubmit={formState.handleSubmit(onSubmit)}
        formType={AuthFormType.SIGN_UP}
        buttonLabel={AuthButtonLabel.SIGN_UP}
        isLoading={isLoading}
      />
    </FormProvider>
  );
};

export default SignUpForm;
