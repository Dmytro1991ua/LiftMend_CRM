import { useCallback } from 'react';

import { DefaultValues, FieldValues, Resolver, UseFormReturn, useForm } from 'react-hook-form';

export type UseFormStateProps<T extends FieldValues> = {
  onCloseModal?: () => void;
  initialValues: DefaultValues<T>;
  resolver?: Resolver<T>;
  shouldFocusError?: boolean;
  mode?: 'onSubmit' | 'onChange' | 'onBlur' | 'all' | 'onTouched';
};

type UseFormState<T extends FieldValues> = {
  onReset: () => void;
  formState: UseFormReturn<T>;
};

export const useFormState = <T extends FieldValues>({
  onCloseModal,
  initialValues,
  resolver,
  shouldFocusError,
  mode,
}: UseFormStateProps<T>): UseFormState<T> => {
  const formState = useForm<T>({
    shouldUnregister: false,
    mode: mode ?? 'onSubmit',
    defaultValues: initialValues,
    resolver,
    shouldFocusError,
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
