import { ApolloError, useMutation } from '@apollo/client';

import { CALENDAR_EVENT_FRAGMENT } from '@/graphql/fragments';
import { UPDATE_REPAIR_JOB } from '@/graphql/schemas/updateRepairJob';
import {
  CalendarEvent,
  UpdateRepairJobMutation,
  UpdateRepairJobMutationVariables,
} from '@/graphql/types/client/generated_types';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
import { RepairJobFormValues } from '@/shared/repair-job/edit-repair-job-form/types';
import { RepairJob } from '@/shared/types';
import { getCalendarEventInfo, getFieldsToUpdateForMutation, onHandleMutationErrors } from '@/shared/utils';

import { STATUS_CHANGE_MESSAGES } from '../config';
import { convertFormFieldsToRepairJob } from '../repair-job-details/utils';

export type UseUpdateRepairJob = {
  isLoading: boolean;
  onUpdateRepairJob: (formFields: RepairJobFormValues, originalRepairJob?: RepairJob) => Promise<void>;
};

export const useUpdateRepairJob = (): UseUpdateRepairJob => {
  const { onError, onSuccess } = useMutationResultToasts();

  const [updateRepairJob, { loading }] = useMutation<UpdateRepairJobMutation, UpdateRepairJobMutationVariables>(
    UPDATE_REPAIR_JOB,
    {
      update(cache, { data }) {
        if (!data) return;

        const { calendarEventId, elevatorType, elevatorLocation, buildingName, jobType } = data.updateRepairJob;

        const { title, description } = getCalendarEventInfo({ elevatorType, elevatorLocation, buildingName, jobType });

        const existingCalendarEvent: CalendarEvent | null = cache.readFragment({
          id: `CalendarEvent:${calendarEventId}`,
          fragment: CALENDAR_EVENT_FRAGMENT,
        });

        cache.writeFragment({
          id: `CalendarEvent:${calendarEventId}`,
          fragment: CALENDAR_EVENT_FRAGMENT,
          data: {
            ...existingCalendarEvent,
            title,
            description,
          },
        });
      },
    }
  );

  const onUpdateRepairJob = async (formFields: RepairJobFormValues, originalRepairJob?: RepairJob) => {
    try {
      const repairJob = convertFormFieldsToRepairJob(formFields, originalRepairJob);
      const fieldsToUpdate = getFieldsToUpdateForMutation(repairJob, originalRepairJob);

      const result = await updateRepairJob({
        variables: {
          input: {
            ...fieldsToUpdate,
            id: repairJob.id,
          },
        },
      });

      const hasErrors = !!result.errors?.length;
      const successDescription = STATUS_CHANGE_MESSAGES[formFields.status ?? '']?.(repairJob.elevatorType);

      if (hasErrors) {
        onHandleMutationErrors({
          message: `Fail to update ${repairJob.jobType} repair job`,
          errors: result.errors,
          onFailure: onError,
        });
      } else {
        onSuccess?.(`Successfully updated scheduled ${repairJob.jobType} repair job`, successDescription);
      }
    } catch (e) {
      onHandleMutationErrors({
        message: 'Update Repair Job Fail',
        error: e as ApolloError,
        onFailure: onError,
      });
    }
  };

  return {
    isLoading: loading,
    onUpdateRepairJob,
  };
};
