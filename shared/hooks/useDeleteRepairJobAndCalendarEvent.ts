import { ApolloError, useMutation } from '@apollo/client';

import { DELETE_REPAIR_JOB_AND_EVENT } from '@/graphql/schemas/deleteRepairJobAndCalendarEvent';
import { DeleteRepairJobAndEventMutation } from '@/graphql/types/client/generated_types';

import { onHandleMutationErrors } from '../utils';

import useMutationResultToasts from './useMutationResultToasts';

type UseDeleteRepairJobAndCalendarEvent = {
  onDeleteRepairJobAndCalendarEvent: (calendarEventId?: string, repairJobId?: string) => Promise<void>;
  isLoading: boolean;
  error?: string;
};

type CacheRef = {
  __ref: string;
};

type RepairJobCacheEdge = {
  __typename: string;
  node: {
    __ref: string;
  };
};

export const DEFAULT_DELETE_CALENDAR_EVENT_AND_REPAIR_JOB_SUCCESS_MESSAGE =
  'Successfully deleted the calendar event and associated scheduled repair job';
export const DEFAULT_DELETE_CALENDAR_EVENT_AND_REPAIR_JOB_FAIL_MESSAGE =
  'Fail to deleted the calendar event and associated scheduled repair job';

export const useDeleteRepairJobAndCalendarEvent = (): UseDeleteRepairJobAndCalendarEvent => {
  const { onError, onSuccess } = useMutationResultToasts();

  const [deleteRepairJonAndCalendarEvent, { loading, error }] = useMutation<DeleteRepairJobAndEventMutation>(
    DELETE_REPAIR_JOB_AND_EVENT,
    {
      update(cache, { data }) {
        if (!data) return;

        const calendarEventId = data?.deleteRepairJobAndEvent.deletedEventId;
        const repairJobId = data?.deleteRepairJobAndEvent.deletedRepairJobId;

        cache.modify({
          fields: {
            getCalendarEvents(existingCalendarEvents = []) {
              const updatedCalendarEvents = existingCalendarEvents.filter(
                (event: CacheRef) => event.__ref !== `CalendarEvent:${calendarEventId}`
              );

              return updatedCalendarEvents;
            },
            getRepairJobs(existingRepairJobs = []) {
              const updatedRepairJobs = existingRepairJobs?.edges.filter(
                (edge: RepairJobCacheEdge) => edge.node.__ref !== `RepairJob:${repairJobId}`
              );

              return {
                ...existingRepairJobs,
                edges: updatedRepairJobs,
                total: (existingRepairJobs.total || 0) + 1,
              };
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
