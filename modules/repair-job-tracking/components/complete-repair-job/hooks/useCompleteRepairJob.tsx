import { useCallback } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { UseFormReturn } from 'react-hook-form';

import { useFormState, useModal } from '@/shared/hooks';
import { useUpdateRepairJob } from '@/shared/repair-job/hooks';
import { RepairJob } from '@/shared/types';

import { CompleteRepairJobFormValues } from '../types';
import { completeRepairJobSchema } from '../validation';

export type UseCompleteRepairJob = {
  formState: UseFormReturn<CompleteRepairJobFormValues>;
  isModalOpen: boolean;
  onHandleCompleteButtonClick: () => void;
  onHandleCloseModal: () => void;
  onHandleComplete: (values: CompleteRepairJobFormValues) => Promise<void>;
  isLoading: boolean;
};

export const useCompleteRepairJob = (repairJob: RepairJob) => {
  const { formState, onReset } = useFormState<CompleteRepairJobFormValues>({
    initialValues: { checklist: repairJob?.checklist ?? [] },
    resolver: zodResolver(completeRepairJobSchema),
  });

  const { onCompleteRepairJob, isLoading } = useUpdateRepairJob();
  const { isModalOpen, onOpenModal, onCloseModal } = useModal();

  const onHandleCompleteButtonClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();

      onOpenModal();
    },
    [onOpenModal]
  );

  const onHandleCloseModal = useCallback(() => {
    onCloseModal();
    onReset();
  }, [onCloseModal, onReset]);

  const onHandleComplete = useCallback(
    async (values: CompleteRepairJobFormValues) => {
      const result = await onCompleteRepairJob({
        ...repairJob,
        checklist: values.checklist,
      });

      if (!result?.errors?.length) onHandleCloseModal();
    },
    [repairJob, onCompleteRepairJob, onHandleCloseModal]
  );

  return {
    formState,
    isModalOpen,
    onHandleCompleteButtonClick,
    onHandleCloseModal,
    onHandleComplete,
    isLoading,
  };
};
