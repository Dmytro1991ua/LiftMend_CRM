import { useMemo } from 'react';

import { useRouter } from 'next/router';
import { FormProvider, SubmitHandler } from 'react-hook-form';
import { Audio } from 'react-loader-spinner';

import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';
import QueryResponse from '@/shared/query-response';
import { getCalendarEventInfo } from '@/shared/utils';

import EditModal from './components/edit-modal';
import EditRepairJobForm from './components/edit-reoair-job-form';
import RepairJobContent from './components/repair-job-content';
import RepairJobHeader from './components/repair-job-header';
import { repairJobSectionsConfig } from './config';
import useFetchRepairJobById from './hooks/useFetchRepairJobById';
import useRepairJobDetailsFormState from './hooks/useRepairJobDetailsFormState';
import useRepairJobDetailsModals from './hooks/useRepairJobDetailsModals';
import useUpdateRepairJob from './hooks/useUpdateRepairJob';
import { RepairJobDetailsFormValues } from './types';
import { getModalTitle } from './utils';

const RepairJobDetails = () => {
  const {
    query: { repairJobId },
  } = useRouter();

  const { repairJob, loading, error } = useFetchRepairJobById(repairJobId as string);

  const { isEditModalOpen, onCloseEditModal, onOpenEditModal } = useRepairJobDetailsModals();

  const { repairJobFormState, onReset } = useRepairJobDetailsFormState({ repairJob, onCloseModal: onCloseEditModal });

  const { onError, onSuccess } = useMutationResultToasts();

  const repairJobSections = useMemo(() => repairJobSectionsConfig(repairJob), [repairJob]);

  const { description, title } = getCalendarEventInfo({
    elevatorType: repairJob.elevatorType,
    elevatorLocation: repairJob.elevatorLocation,
    buildingName: repairJob.buildingName,
    jobType: repairJob.jobType,
  });

  const { onUpdateRepairJob, isLoading } = useUpdateRepairJob({ onError, onSuccess });

  const onSubmit: SubmitHandler<RepairJobDetailsFormValues> = async (data) => {
    const updatedRepairJob = {
      ...data,
      id: repairJob.id,
      calendarEventId: repairJob.calendarEventId,
    };

    await onUpdateRepairJob(updatedRepairJob, repairJob);

    onReset();
  };

  const REPAIR_JOB_DETAILS_MODALS_CONFIG = [
    {
      id: 1,
      content: (
        <EditModal
          isDisabled={!repairJobFormState.formState.isDirty || isLoading}
          isOpen={isEditModalOpen}
          title={getModalTitle(title, true)}
          onClose={onReset}
          onSubmit={repairJobFormState.handleSubmit(onSubmit)}
        >
          <EditRepairJobForm repairJob={repairJob} />
        </EditModal>
      ),
    },
  ];

  return (
    <FormProvider {...repairJobFormState}>
      <section>
        <RepairJobHeader description={description} loading={loading} title={title} onOpenEditModal={onOpenEditModal} />
        <div className='content-wrapper h-[73vh] overflow-y-auto overflow-x-hidden'>
          <>
            <QueryResponse
              errorDescription={error}
              errorMessage={`Failed to fetch Repair Job Details by ${repairJobId}`}
              loading={loading}
              loadingComponent={
                <Audio
                  ariaLabel='bars-loading'
                  color='#2563eb'
                  height='80'
                  visible={true}
                  width='80'
                  wrapperClass='h-full items-center justify-center'
                />
              }
            />
            <RepairJobContent error={error} loading={loading} repairJobSections={repairJobSections} />
          </>
        </div>
        {REPAIR_JOB_DETAILS_MODALS_CONFIG.map((config) => (
          <div key={config.id}>{config.content}</div>
        ))}
      </section>
    </FormProvider>
  );
};

export default RepairJobDetails;
