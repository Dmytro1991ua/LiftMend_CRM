import useDeleteRepairJobAndCalendarEvent from '@/shared/hooks/useDeleteRepairJobAndCalendarEvent';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';

type UseRepairJobDeletionProps = {
  calendarEventId?: string;
  repairJobId?: string;
  onCloseModal: () => void;
  onRedirect?: () => void;
};

type UseRepairJobDeletion = {
  isDeleteRepairJobLoading: boolean;
  onDeleteRepairJob: () => Promise<void>;
  onDeleteCalendarEvent: (calendarEventId?: string, repairJobId?: string) => Promise<void>;
};

export const useRepairJobDeletion = ({
  calendarEventId,
  repairJobId,
  onCloseModal,
  onRedirect,
}: UseRepairJobDeletionProps): UseRepairJobDeletion => {
  const { onError, onSuccess } = useMutationResultToasts();

  const { onDeleteRepairJobAndCalendarEvent, isLoading } = useDeleteRepairJobAndCalendarEvent({
    onError,
    onSuccess,
  });

  const onDeleteRepairJob = async () => {
    await onDeleteRepairJobAndCalendarEvent(calendarEventId, repairJobId);

    onCloseModal();

    onRedirect && onRedirect();
  };

  const onDeleteCalendarEvent = async (calendarEventId?: string, repairJobId?: string) => {
    await onDeleteRepairJobAndCalendarEvent(calendarEventId, repairJobId);

    onCloseModal();
  };

  return {
    onDeleteRepairJob,
    onDeleteCalendarEvent,
    isDeleteRepairJobLoading: isLoading,
  };
};
