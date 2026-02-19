import { useCallback } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { UseFormReturn } from 'react-hook-form';

import { ElevatorStatus, ElevatorStatusConfig } from '@/modules/elevator-management/types';
import { useFormState, useModal } from '@/shared/hooks';

import { getElevatorStatusUpdateConfig } from '../config';
import { ElevatorStatusFormValues } from '../types';
import { createElevatorStatusToggleSchema } from '../validation';

import { useUpdateElevatorRecordVisibility } from './useUpdateElevatorRecordVisibility';

export type UseUpdateElevatorStatusProps = {
  status: ElevatorStatus;
  elevatorRecordId: string;
  lastKnownStatus?: string | null;
  onRedirect?: () => void;
};

export type UseUpdateElevatorStatus = {
  formState: UseFormReturn<ElevatorStatusFormValues>;
  config: ElevatorStatusConfig;
  isModalOpen: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
  onHandleElevatorRecordStatusChange: (values: ElevatorStatusFormValues) => Promise<void>;
  loading: boolean;
};

export default function useUpdateElevatorRecordStatus({
  status,
  elevatorRecordId,
  lastKnownStatus,
  onRedirect,
}: UseUpdateElevatorStatusProps): UseUpdateElevatorStatus {
  const isElevatorOperational = status !== 'Out of Service';

  const { isModalOpen, onCloseModal, onOpenModal } = useModal();

  const { loading, onUpdateElevatorRecordStatus } = useUpdateElevatorRecordVisibility();

  const { formState, onReset } = useFormState<ElevatorStatusFormValues>({
    initialValues: { deactivationReason: '' },
    resolver: zodResolver(createElevatorStatusToggleSchema(isElevatorOperational)),
    onCloseModal,
  });

  const config = getElevatorStatusUpdateConfig(status, lastKnownStatus ?? '') || {};

  const onHandleElevatorRecordStatusChange = useCallback(
    async ({ deactivationReason }: ElevatorStatusFormValues) => {
      const result = await onUpdateElevatorRecordStatus({
        id: elevatorRecordId,
        newStatus: config.newElevatorStatus,
        currentStatus: status,
        deactivationReason,
      });

      onReset();

      if (!result?.errors?.length) onRedirect && onRedirect();
    },
    [elevatorRecordId, config.newElevatorStatus, onReset, status, onUpdateElevatorRecordStatus, onRedirect]
  );

  const onHandleCloseModal = useCallback(() => {
    onReset();
    onCloseModal();
  }, [onReset, onCloseModal]);

  return {
    config,
    isModalOpen,
    formState,
    onOpenModal,
    onCloseModal: onHandleCloseModal,
    onHandleElevatorRecordStatusChange,
    loading,
  };
}
