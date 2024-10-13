import { useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { FormProvider } from 'react-hook-form';
import { Audio } from 'react-loader-spinner';

import DeleteModal from '@/shared/base-modal/delete-modal';
import EditModal from '@/shared/base-modal/edit-modal';
import { getModalTitle } from '@/shared/base-modal/edit-modal/utils';
import useFormState from '@/shared/hooks/useFormState';
import QueryResponse from '@/shared/query-response';
import { DEFAULT_DELETE_MODAL_TITLE } from '@/shared/repair-job/constants';
import EditRepairJobForm from '@/shared/repair-job/edit-repair-job-form';
import { RepairJobFormValues } from '@/shared/repair-job/edit-repair-job-form/types';
import { repairJobEditFormSchema } from '@/shared/repair-job/edit-repair-job-form/validation';
import useRepairJobDeletion from '@/shared/repair-job/hooks/useRepairJobDeletion';
import useRepairJobFormHandler from '@/shared/repair-job/hooks/useRepairJobFormHandler';
import { getDeleteModalDescription } from '@/shared/repair-job/utils';
import { getCalendarEventInfo } from '@/shared/utils';

import RepairJobContent from './components/repair-job-content';
import RepairJobHeader from './components/repair-job-header';
import { repairJobSectionsConfig } from './config';
import useFetchRepairJobById from './hooks/useFetchRepairJobById';
import useRepairJobDetailsModals from './hooks/useRepairJobDetailsModals';
import { convertRepairJobToFormValues } from './utils';

const RepairJobDetails = () => {
  const {
    query: { repairJobId },
    back,
  } = useRouter();

  const { repairJob, loading, error } = useFetchRepairJobById(repairJobId as string);

  const {
    isEditModalOpen,
    isDeleteModalOpen,
    onCloseEditModal,
    onOpenEditModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
  } = useRepairJobDetailsModals();

  const currentRepairJob = useMemo(() => convertRepairJobToFormValues(repairJob), [repairJob]);

  const { formState, onReset } = useFormState<RepairJobFormValues>({
    initialValues: currentRepairJob,
    onCloseModal: onCloseEditModal,
    resolver: zodResolver(repairJobEditFormSchema),
  });

  const repairJobSections = useMemo(() => repairJobSectionsConfig(repairJob), [repairJob]);

  const { onEditRepairJob, isEditRepairJobLoading } = useRepairJobFormHandler({ repairJob, onReset });

  const { isDeleteRepairJobLoading, onDeleteRepairJob } = useRepairJobDeletion({
    onCloseModal: onCloseDeleteModal,
    calendarEventId: repairJob.calendarEventId ?? '',
    repairJobId: repairJob.id,
    onRedirect: () => back(),
  });

  const { description, title } = getCalendarEventInfo({
    elevatorType: repairJob.elevatorType,
    elevatorLocation: repairJob.elevatorLocation,
    buildingName: repairJob.buildingName,
    jobType: repairJob.jobType,
  });

  const REPAIR_JOB_DETAILS_MODALS_CONFIG = [
    {
      id: 1,
      content: (
        <EditModal
          isDisabled={!formState.formState.isDirty || isEditRepairJobLoading}
          isOpen={isEditModalOpen}
          title={getModalTitle(title, true)}
          onClose={onReset}
          onSubmit={formState.handleSubmit(onEditRepairJob)}
        >
          <EditRepairJobForm repairJob={repairJob} />
        </EditModal>
      ),
    },
    {
      id: 2,
      content: (
        <DeleteModal
          description={getDeleteModalDescription(title)}
          isDisabled={isDeleteRepairJobLoading}
          isLoading={isDeleteRepairJobLoading}
          isOpen={isDeleteModalOpen}
          title={DEFAULT_DELETE_MODAL_TITLE}
          onClose={onCloseDeleteModal}
          onSubmit={onDeleteRepairJob}
        />
      ),
    },
  ];

  return (
    <FormProvider {...formState}>
      <section>
        <RepairJobHeader
          description={description}
          loading={loading}
          title={title}
          onOpenDeleteModal={onOpenDeleteModal}
          onOpenEditModal={onOpenEditModal}
        />
        <div className='content-wrapper h-[72vh] overflow-y-auto overflow-x-hidden'>
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
