import { useCallback, useEffect, useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { UseFormReturn, useForm } from 'react-hook-form';

import { RepairJob } from '@/graphql/types/client/generated_types';

import { convertRepairJobToFormValues } from '../../../modules/repair-job-details/utils';
import { RepairJobFormValues } from '../edit-repair-job-form/types';
import { repairJobEditFormSchema } from '../edit-repair-job-form/validation';

type UseRepairJobDetailsFormStateProps = {
  onCloseModal: () => void;
  repairJob: RepairJob;
};

type UseRepairJobDetailsFormState = {
  onReset: () => void;
  repairJobFormState: UseFormReturn<RepairJobFormValues>;
};

const useRepairJobDetailsFormState = ({
  repairJob,
  onCloseModal,
}: UseRepairJobDetailsFormStateProps): UseRepairJobDetailsFormState => {
  const currentRepairJob = useMemo(() => convertRepairJobToFormValues(repairJob), [repairJob]);

  const formState = useForm<RepairJobFormValues>({
    shouldUnregister: false,
    mode: 'onChange',
    defaultValues: currentRepairJob,
    resolver: zodResolver(repairJobEditFormSchema),
  });

  const { reset, clearErrors } = formState;

  useEffect(() => {
    reset(currentRepairJob, { keepDirty: false });
  }, [currentRepairJob, reset]);

  const onReset = useCallback((): void => {
    reset(currentRepairJob, { keepDirty: false });
    clearErrors();
    onCloseModal();
  }, [reset, onCloseModal, currentRepairJob, clearErrors]);

  return {
    repairJobFormState: formState,
    onReset,
  };
};

export default useRepairJobDetailsFormState;
