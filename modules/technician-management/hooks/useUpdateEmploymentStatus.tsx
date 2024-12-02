import { useCallback } from 'react';

import { useModal } from '@/shared/hooks';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';

import { EMPLOYMENT_STATUS_UPDATE_CONFIG } from '../config';
import { EmploymentStatus, EmploymentStatusConfig } from '../types';

import useUpdateTechnicianVisibility from './useUpdateTechnicianVisibility';

type UseUpdateEmploymentStatusProps = {
  employmentStatus: EmploymentStatus;
  technicianId: string;
  onRedirect?: () => void;
};

type UseUpdateEmploymentStatus = {
  loading: boolean;
  config: EmploymentStatusConfig;
  isModalOpen: boolean;
  error?: string;
  onOpenModal: () => void;
  onHandleEmploymentStatusChange: () => void;
  onCloseModal: () => void;
};

const useUpdateEmploymentStatus = ({
  employmentStatus,
  technicianId,
  onRedirect,
}: UseUpdateEmploymentStatusProps): UseUpdateEmploymentStatus => {
  const { isModalOpen, onCloseModal, onOpenModal } = useModal();
  const { onError, onSuccess } = useMutationResultToasts();

  const { loading, onUpdateEmploymentStatus } = useUpdateTechnicianVisibility({
    onError,
    onSuccess,
  });

  const config = EMPLOYMENT_STATUS_UPDATE_CONFIG[employmentStatus] || {};

  const onHandleEmploymentStatusChange = useCallback(async () => {
    const result = await onUpdateEmploymentStatus(
      technicianId,
      config.newEmploymentStatus,
      config.newAvailabilityStatus
    );

    onCloseModal();

    if (!result?.errors?.length) onRedirect && onRedirect();
  }, [
    config.newEmploymentStatus,
    config.newAvailabilityStatus,
    onCloseModal,
    onUpdateEmploymentStatus,
    technicianId,
    onRedirect,
  ]);

  return {
    loading,
    config,
    isModalOpen,
    onOpenModal,
    onCloseModal,
    onHandleEmploymentStatusChange,
  };
};

export default useUpdateEmploymentStatus;
