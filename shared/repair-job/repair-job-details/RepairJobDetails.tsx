import { useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { FormProvider } from 'react-hook-form';

import BaseDetailsPage from '@/shared/base-details-page';
import useDetailsPageModals from '@/shared/base-details-page/hooks/useDetailsPageModals';
import { getCommonDetailsPageActionButtonsConfig } from '@/shared/base-details-page/utils';
import DeleteModal from '@/shared/base-modal/delete-modal';
import EditModal from '@/shared/base-modal/edit-modal';
import { getModalTitle } from '@/shared/base-modal/edit-modal/utils';
import useFormState from '@/shared/hooks/useFormState';
import { DEFAULT_DELETE_MODAL_TITLE } from '@/shared/repair-job/constants';
import EditRepairJobForm from '@/shared/repair-job/edit-repair-job-form';
import { RepairJobFormValues } from '@/shared/repair-job/edit-repair-job-form/types';
import { repairJobEditFormSchema } from '@/shared/repair-job/edit-repair-job-form/validation';
import useRepairJobDeletion from '@/shared/repair-job/hooks/useRepairJobDeletion';
import useRepairJobFormHandler from '@/shared/repair-job/hooks/useRepairJobFormHandler';
import { getDeleteModalDescription } from '@/shared/repair-job/utils';
import { getCalendarEventInfo } from '@/shared/utils';

import { repairJobSectionsConfig } from './config';
import useFetchRepairJobById from './hooks/useFetchRepairJobById';
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
  } = useDetailsPageModals();

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
          <EditRepairJobForm repairJobFormValues={currentRepairJob} />
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

  const actionButtonsConfig = useMemo(
    () => getCommonDetailsPageActionButtonsConfig({ onOpenDeleteModal, onOpenEditModal }),
    [onOpenDeleteModal, onOpenEditModal]
  );

  return (
    <FormProvider {...formState}>
      <BaseDetailsPage
        actionButtonsConfig={actionButtonsConfig}
        description={description}
        detailsPageSections={repairJobSections}
        error={error}
        errorMessage={`Failed to fetch Repair Job Details by ${repairJobId}`}
        loading={loading}
        modalConfig={REPAIR_JOB_DETAILS_MODALS_CONFIG}
        title={title}
      />
    </FormProvider>
  );
};

export default RepairJobDetails;
