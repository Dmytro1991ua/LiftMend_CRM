import { ApolloError, useMutation } from '@apollo/client';

import { onHandleMutationErrors } from '@/graphql';
import { CALENDAR_EVENT_FRAGMENT } from '@/graphql/fragments';
import { UPDATE_REPAIR_JOB } from '@/graphql/schemas/updateRepairJob';
import {
  CalendarEvent,
  RepairJob,
  UpdateRepairJobMutation,
  UpdateRepairJobMutationVariables,
} from '@/graphql/types/client/generated_types';
import { RepairJobFormValues } from '@/shared/repair-job/edit-repair-job-form/types';
import { getCalendarEventInfo } from '@/shared/utils';

import { convertFormFieldsToRepairJob, getFieldsToUpdate } from '../../../modules/repair-job-details/utils';

type UseUpdateRepairJobProps = {
  onSuccess?: (message: string) => void;
  onError?: (errorMessage: string, errorDescription: string) => void;
};

type UseUpdateRepairJob = {
  isLoading: boolean;
  onUpdateRepairJob: (formFields: RepairJobFormValues, originalRepairJob: RepairJob) => Promise<void>;
};

const useUpdateRepairJob = ({ onSuccess, onError }: UseUpdateRepairJobProps): UseUpdateRepairJob => {
  const [updateRepairJob, { loading }] = useMutation<UpdateRepairJobMutation, UpdateRepairJobMutationVariables>(
    UPDATE_REPAIR_JOB,
    {
      update(cache, { data }) {
        if (!data) return;

        const { calendarEventId, startDate, endDate, elevatorType, elevatorLocation, buildingName, jobType } =
          data.updateRepairJob;

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
            start: startDate,
            end: endDate,
          },
        });
      },
    }
  );

  const onUpdateRepairJob = async (formFields: RepairJobFormValues, originalRepairJob: RepairJob) => {
    try {
      const repairJob = convertFormFieldsToRepairJob(formFields);
      const fieldsToUpdate = getFieldsToUpdate(repairJob, originalRepairJob);

      const result = await updateRepairJob({
        variables: {
          input: {
            id: repairJob.id,
            ...fieldsToUpdate,
          },
        },
      });

      const hasErrors = !!result.errors?.length;

      if (hasErrors) {
        onHandleMutationErrors({
          message: `Fail to update ${repairJob.jobType} repair job`,
          errors: result.errors,
          onFailure: onError,
        });
      } else {
        onSuccess?.(`Successfully updated scheduled ${repairJob.jobType} repair job`);
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

export default useUpdateRepairJob;
