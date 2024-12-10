import { useCallback } from 'react';

import { ElevatorStatus, ElevatorStatusConfig } from '@/modules/elevator-management/types';
import { useModal } from '@/shared/hooks';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';

import { getElevatorStatusUpdateConfig } from '../config';

import useUpdateElevatorRecordVisibility from './useUpdateElevatorRecordVisibility';

type UseUpdateEmploymentStatusProps = {
  status: ElevatorStatus;
  elevatorRecordId: string;
  lastKnownStatus?: string | null;
  onRedirect?: () => void;
};

type UseUpdateEmploymentStatus = {
  config: ElevatorStatusConfig;
  isModalOpen: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
  onHandleElevatorRecordStatusChange: () => Promise<void>;
  loading: boolean;
};

const useUpdateElevatorRecordStatus = ({
  status,
  elevatorRecordId,
  lastKnownStatus,
  onRedirect,
}: UseUpdateEmploymentStatusProps): UseUpdateEmploymentStatus => {
  const { isModalOpen, onCloseModal, onOpenModal } = useModal();
  const { onError, onSuccess } = useMutationResultToasts();

  const { loading, onUpdateElevatorRecordStatus } = useUpdateElevatorRecordVisibility({
    onError,
    onSuccess,
  });

  const config = getElevatorStatusUpdateConfig(status, lastKnownStatus ?? '') || {};

  const onHandleElevatorRecordStatusChange = useCallback(async () => {
    const result = await onUpdateElevatorRecordStatus({
      id: elevatorRecordId,
      newStatus: config.newElevatorStatus,
      currentStatus: status,
    });

    onCloseModal();

    if (!result?.errors?.length) onRedirect && onRedirect();
  }, [elevatorRecordId, config.newElevatorStatus, onCloseModal, status, onUpdateElevatorRecordStatus, onRedirect]);

  return {
    config,
    isModalOpen,
    onOpenModal,
    onCloseModal,
    onHandleElevatorRecordStatusChange,
    loading,
  };
};

export default useUpdateElevatorRecordStatus;
