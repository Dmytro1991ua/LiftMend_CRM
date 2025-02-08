import { useCallback } from 'react';

import { DefaultValues, FieldValues, Resolver, UseFormReturn, useForm } from 'react-hook-form';

type UseFormStateProps<T extends FieldValues> = {
  onCloseModal?: () => void;
  initialValues: DefaultValues<T>;
  resolver?: Resolver<T>;
};

type UseFormState<T extends FieldValues> = {
  onReset: () => void;
  formState: UseFormReturn<T>;
};

const useFormState = <T extends FieldValues>({
  onCloseModal,
  initialValues,
  resolver,
}: UseFormStateProps<T>): UseFormState<T> => {
  const formState = useForm<T>({
    shouldUnregister: false,
    mode: 'onSubmit',
    defaultValues: initialValues,
    resolver,
  });

  const { reset, clearErrors } = formState;

  const onReset = useCallback((): void => {
    reset(initialValues);
    clearErrors();
    onCloseModal?.();
  }, [reset, clearErrors, onCloseModal, initialValues]);

  return {
    formState,
    onReset,
  };
};

export default useFormState;
