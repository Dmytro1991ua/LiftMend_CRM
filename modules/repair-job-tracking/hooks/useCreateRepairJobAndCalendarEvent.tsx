import { ApolloError, useMutation } from '@apollo/client';
import { DateSelectArg } from '@fullcalendar/core';

import { onHandleMutationErrors } from '@/graphql';
import { CREATE_REPAIR_JOB_AND_CALENDAR_EVENT, GET_CALENDAR_EVENTS } from '@/graphql/schemas';
import {
  CreateRepairJobAndCalendarEventMutation,
  GetCalendarEventsQuery,
} from '@/graphql/types/client/generated_types';
import { getCalendarEventInfo } from '@/shared/utils';

import { RepairJobFromFields } from '../components/repair-job-tracking-from/validation';
import { DEFAULT_SCHEDULE_REPAIR_JOB_FAIL_MESSAGE, DEFAULT_SCHEDULE_REPAIR_JOB_SUCCESS_MESSAGE } from '../constants';

type UseCreateRepairJobAndCalendarEventProps = {
  onSuccess?: (message: string) => void;
  onError?: (errorMessage: string, errorDescription: string) => void;
};

type UseCreateRepairJobAndCalendarEvent = {
  isLoading: boolean;
  onCreateRepairJobAndEvent: (
    formFields: RepairJobFromFields,
    selectedDateRange: DateSelectArg | null
  ) => Promise<void>;
};

const useCreateRepairJobAndCalendarEvent = ({
  onSuccess,
  onError,
}: UseCreateRepairJobAndCalendarEventProps): UseCreateRepairJobAndCalendarEvent => {
  const [createRepairJobAndEvent, { loading }] = useMutation<CreateRepairJobAndCalendarEventMutation>(
    CREATE_REPAIR_JOB_AND_CALENDAR_EVENT,
    {
      update: (cache, { data }) => {
        if (!data) return;

        const newCalendarEvent = data?.createRepairJobAndEvent.calendarEvent;

        const existingData = cache.readQuery<GetCalendarEventsQuery>({
          query: GET_CALENDAR_EVENTS,
        });

        cache.writeQuery({
          query: GET_CALENDAR_EVENTS,
          data: {
            getCalendarEvents: [newCalendarEvent, ...(existingData?.getCalendarEvents || [])],
          },
        });
      },
    }
  );

  const onCreateRepairJobAndEvent = async (
    formFields: RepairJobFromFields,
    selectedDateRange: DateSelectArg | null
  ): Promise<void> => {
    try {
      const {
        jobDetails: { jobType, jobDescription, priority },
        elevatorInformation: { elevatorLocation, elevatorType, buildingName },
        technicianAssignment: { technicianName, technicianSkills, contactInformation },
      } = formFields;

      const { description, title } = getCalendarEventInfo({ elevatorType, elevatorLocation, buildingName, jobType });

      const repairJobPayload = {
        buildingName,
        elevatorLocation,
        elevatorType,
        endDate: selectedDateRange?.end,
        jobDetails: jobDescription,
        jobPriority: priority,
        jobType,
        startDate: selectedDateRange?.start,
        technicianName,
        technicianSkills,
        contactInformation,
      };

      const calendarEventPayload = {
        allDay: selectedDateRange?.allDay ?? false,
        description,
        end: selectedDateRange?.end,
        start: selectedDateRange?.start,
        title,
      };

      const result = await createRepairJobAndEvent({
        variables: {
          repairJobInput: repairJobPayload,
          calendarEventInput: calendarEventPayload,
        },
      });

      const hasErrors = !!result.errors?.length;

      if (hasErrors) {
        onHandleMutationErrors({
          message: DEFAULT_SCHEDULE_REPAIR_JOB_FAIL_MESSAGE,
          errors: result.errors,
          onFailure: onError,
        });
      } else {
        onSuccess?.(DEFAULT_SCHEDULE_REPAIR_JOB_SUCCESS_MESSAGE);
      }
    } catch (e) {
      onHandleMutationErrors({
        message: DEFAULT_SCHEDULE_REPAIR_JOB_FAIL_MESSAGE,
        error: e as ApolloError,
        onFailure: onError,
      });
    }
  };

  return { onCreateRepairJobAndEvent, isLoading: loading };
};

export default useCreateRepairJobAndCalendarEvent;
