import { ApolloError, useMutation } from '@apollo/client';

import { onHandleMutationErrors } from '@/graphql';
import { DELETE_REPAIR_JOB_AND_EVENT } from '@/graphql/schemas/deleteRepairJobAndCalendarEvent';
import { DeleteRepairJobAndEventMutation } from '@/graphql/types/client/generated_types';

import {
  DEFAULT_DELETE_CALENDAR_EVENT_AND_REPAIR_JOB_FAIL_MESSAGE,
  DEFAULT_DELETE_CALENDAR_EVENT_AND_REPAIR_JOB_SUCCESS_MESSAGE,
} from './../constants';

type UseDeleteRepairJobAndCalendarEventProps = {
  onSuccess?: (message: string) => void;
  onError?: (errorMessage: string, errorDescription: string) => void;
};

type UseDeleteRepairJobAndCalendarEvent = {
  onDeleteRepairJobAndCalendarEvent: (calendarEventId?: string, repairJobId?: string) => Promise<void>;
  isLoading: boolean;
  error?: string;
};

type CacheRef = {
  __ref: string;
};

const useDeleteRepairJobAndCalendarEvent = ({
  onSuccess,
  onError,
}: UseDeleteRepairJobAndCalendarEventProps): UseDeleteRepairJobAndCalendarEvent => {
  const [deleteRepairJonAndCalendarEvent, { loading, error }] = useMutation<DeleteRepairJobAndEventMutation>(
    DELETE_REPAIR_JOB_AND_EVENT,
    {
      update(cache, { data }) {
        if (!data) return;

        const calendarEventId = data?.deleteRepairJobAndEvent.deletedEventId;

        cache.modify({
          fields: {
            getCalendarEvents(existingCalendarEvents = []) {
              const updatedCalendarEvents = existingCalendarEvents.filter(
                (event: CacheRef) => event.__ref !== `CalendarEvent:${calendarEventId}`
              );

              return updatedCalendarEvents;
            },
          },
        });
      },
    }
  );

  const onDeleteRepairJobAndCalendarEvent = async (calendarEventId?: string, repairJobId?: string) => {
    try {
      const result = await deleteRepairJonAndCalendarEvent({
        variables: { calendarEventId, repairJobId },
      });

      const hasErrors = !!result.errors?.length;

      if (hasErrors) {
        onHandleMutationErrors({
          message: DEFAULT_DELETE_CALENDAR_EVENT_AND_REPAIR_JOB_FAIL_MESSAGE,
          errors: result.errors,
          onFailure: onError,
        });
      } else {
        onSuccess?.(DEFAULT_DELETE_CALENDAR_EVENT_AND_REPAIR_JOB_SUCCESS_MESSAGE);
      }
    } catch (e) {
      onHandleMutationErrors({
        message: DEFAULT_DELETE_CALENDAR_EVENT_AND_REPAIR_JOB_FAIL_MESSAGE,
        error: e as ApolloError,
        onFailure: onError,
      });
    }
  };

  return { onDeleteRepairJobAndCalendarEvent, isLoading: loading, error: error?.message };
};
export default useDeleteRepairJobAndCalendarEvent;
