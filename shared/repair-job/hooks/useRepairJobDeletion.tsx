import { useCallback } from 'react';

import { useDeleteRepairJobAndCalendarEvent } from '@/shared/hooks';

type UseRepairJobDeletionProps = {
  calendarEventId?: string;
  repairJobId?: string;
  onCloseModal: () => void;
  onRedirect?: () => void;
};

export type UseRepairJobDeletion = {
  isDeleteRepairJobLoading: boolean;
  onDeleteRepairJob: () => Promise<void>;
  onDeleteCalendarEvent: (repairJobId?: string) => Promise<void>;
};

export const useRepairJobDeletion = ({
  repairJobId,
  onCloseModal,
  onRedirect,
}: UseRepairJobDeletionProps): UseRepairJobDeletion => {
  const { onDeleteRepairJobAndCalendarEvent, isLoading } = useDeleteRepairJobAndCalendarEvent();

  const onDeleteRepairJob = async () => {
    const result = await onDeleteRepairJobAndCalendarEvent(repairJobId);

    if (!result?.errors?.length) onCloseModal();

    onRedirect && onRedirect();
  };

  const onDeleteCalendarEvent = useCallback(
    async (repairJobId?: string) => {
      const result = await onDeleteRepairJobAndCalendarEvent(repairJobId);

      if (!result?.errors?.length) onCloseModal();
    },
    [onDeleteRepairJobAndCalendarEvent, onCloseModal]
  );

  return {
    onDeleteRepairJob,
    onDeleteCalendarEvent,
    isDeleteRepairJobLoading: isLoading,
  };
};
