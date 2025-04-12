import { ApolloError, useMutation } from '@apollo/client';

import { onHandleMutationErrors } from '@/shared/utils';
import { CALENDAR_EVENT_FRAGMENT } from '@/graphql/fragments';
import { UPDATE_REPAIR_JOB } from '@/graphql/schemas/updateRepairJob';
import {
  CalendarEvent,
  UpdateRepairJobMutation,
  UpdateRepairJobMutationVariables,
} from '@/graphql/types/client/generated_types';
import { RepairJobFormValues } from '@/shared/repair-job/edit-repair-job-form/types';
import { RepairJob } from '@/shared/types';
import { getCalendarEventInfo, getFieldsToUpdateForMutation } from '@/shared/utils';

import { STATUS_CHANGE_MESSAGES } from '../config';
import { convertFormFieldsToRepairJob } from '../repair-job-details/utils';

type UseUpdateRepairJobProps = {
  onSuccess?: (message: string, description?: string) => void;
  onError?: (errorMessage: string, errorDescription: string) => void;
};

type UseUpdateRepairJob = {
  isLoading: boolean;
  onUpdateRepairJob: (formFields: RepairJobFormValues, originalRepairJob?: RepairJob) => Promise<void>;
};

const useUpdateRepairJob = ({ onSuccess, onError }: UseUpdateRepairJobProps): UseUpdateRepairJob => {
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
      const repairJob = convertFormFieldsToRepairJob(formFields);
      const fieldsToUpdate = getFieldsToUpdateForMutation(repairJob, originalRepairJob);

      const result = await updateRepairJob({
        variables: {
          input: {
            id: repairJob.id,
            technicianName: originalRepairJob?.technicianName,
            ...fieldsToUpdate,
          },
        },
      });

      const hasErrors = !!result.errors?.length;
      const successDescription = STATUS_CHANGE_MESSAGES[formFields.status ?? ''];

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

export default useUpdateRepairJob;
