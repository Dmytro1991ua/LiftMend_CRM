import { useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { FormProvider } from 'react-hook-form';

import BaseDetailsPage from '@/shared/base-details-page';
import useDetailsPageModals from '@/shared/base-details-page/hooks/useDetailsPageModals';
import { getTechnicianDetailsPageActionButtonsConfig } from '@/shared/base-details-page/utils';
import DeleteModal from '@/shared/base-modal/delete-modal';
import EditModal from '@/shared/base-modal/edit-modal';
import { getModalTitle } from '@/shared/base-modal/edit-modal/utils';
import { useFormState } from '@/shared/hooks';
import { getDeleteModalDescription } from '@/shared/utils';

import { DEFAULT_DELETE_TECHNICIAN_MODAL_TITLE } from '../../constants';
import useUpdateEmploymentStatus from '../../hooks/useUpdateEmploymentStatus';
import { EmploymentStatus, TechnicianRecordFormValues } from '../../types';
import { convertTechnicianRecordToFormValues } from '../../utils';
import useTechnicianRecordDeletion from '../delete-action-cell/hooks/useTechnicianRecordDeletion';
import EditTechnicianRecordForm from '../edit-technician-record-form';
import { technicianRecordEditFormSchema } from '../edit-technician-record-form/validation';
import useEditTechnicianRecordForm from '../technician-record-form/hooks/useEditTechnicianRecordForm';

import { technicianRecordSectionsConfig } from './config';
import { useFetchTechnicianRecordById } from './hooks';

const TechnicianRecordDetails = () => {
  const {
    query: { technicianRecordId },
    back,
  } = useRouter();

  const {
    isEditModalOpen,
    isDeleteModalOpen,
    onCloseEditModal,
    onOpenEditModal,
    onOpenDeleteModal,
    onCloseDeleteModal,
  } = useDetailsPageModals();

  const { technicianRecord, loading, error } = useFetchTechnicianRecordById(technicianRecordId as string);

  const currentTechnicianRecord = useMemo(
    () => convertTechnicianRecordToFormValues(technicianRecord),
    [technicianRecord]
  );

  const technicianRecordDetailsTitle = `${technicianRecord.name}'s Record Details`;

  const { formState, onReset } = useFormState<TechnicianRecordFormValues>({
    initialValues: currentTechnicianRecord,
    onCloseModal: onCloseEditModal,
    resolver: zodResolver(technicianRecordEditFormSchema),
  });

  const { isUpdateRecordLoading, onEditTechnicianRecord } = useEditTechnicianRecordForm({ onReset, technicianRecord });

  const {
    loading: isEmploymentStatusUpdate,
    config,
    isModalOpen,
    onHandleEmploymentStatusChange,
    onOpenModal,
    onCloseModal,
  } = useUpdateEmploymentStatus({
    employmentStatus: technicianRecord.employmentStatus as EmploymentStatus,
    technicianId: technicianRecord.id,
    availabilityStatus: technicianRecord?.availabilityStatus,
    lastKnownAvailabilityStatus: technicianRecord.lastKnownAvailabilityStatus,
    onRedirect: () => back(),
  });

  const { isDeleteTechnicianRecordLoading, onHandleDeleteTechnicianRecord } = useTechnicianRecordDeletion({
    onCloseModal: onCloseDeleteModal,
    id: technicianRecord.id,
    onRedirect: () => back(),
  });

  const technicianRecordDetailsSections = useMemo(
    () => technicianRecordSectionsConfig(technicianRecord),
    [technicianRecord]
  );

  const actionButtonsConfig = useMemo(
    () =>
      getTechnicianDetailsPageActionButtonsConfig({
        onOpenEditModal,
        onOpenUpdateEmploymentStatusModal: onOpenModal,
        onOpenDeleteModal,
      }),
    [onOpenEditModal, onOpenModal, onOpenDeleteModal]
  );

  const TECHNICIAN_RECORD_DETAILS_MODALS_CONFIG = [
    {
      id: 1,
      content: (
        <EditModal
          isDisabled={!formState.formState.isDirty || isUpdateRecordLoading}
          isOpen={isEditModalOpen}
          title={getModalTitle(technicianRecordDetailsTitle, true)}
          onClose={onReset}
          onSubmit={formState.handleSubmit(onEditTechnicianRecord)}>
          <EditTechnicianRecordForm technicianRecordFormValues={technicianRecord} />
        </EditModal>
      ),
    },
    {
      id: 2,
      content: (
        <DeleteModal
          description={getDeleteModalDescription(technicianRecordDetailsTitle)}
          isDisabled={isDeleteTechnicianRecordLoading}
          isLoading={isDeleteTechnicianRecordLoading}
          isOpen={isDeleteModalOpen}
          title={DEFAULT_DELETE_TECHNICIAN_MODAL_TITLE}
          onClose={onCloseDeleteModal}
          onSubmit={onHandleDeleteTechnicianRecord}
        />
      ),
    },
    {
      id: 2,
      content: (
        <EditModal
          cancelButtonLabel='No'
          isDisabled={isEmploymentStatusUpdate}
          isOpen={isModalOpen}
          submitButtonLabel='Yes'
          title={config.modalTitle}
          onClose={onCloseModal}
          onSubmit={onHandleEmploymentStatusChange}>
          {config.modalMessage}
        </EditModal>
      ),
    },
  ];

  return (
    <FormProvider {...formState}>
      <BaseDetailsPage
        actionButtonsConfig={actionButtonsConfig}
        detailsPageSections={technicianRecordDetailsSections}
        error={error}
        errorMessage={`Failed to fetch Technician Record Details by ${technicianRecordId}`}
        loading={loading}
        modalConfig={TECHNICIAN_RECORD_DETAILS_MODALS_CONFIG}
        title={technicianRecordDetailsTitle}
      />
    </FormProvider>
  );
};

export default TechnicianRecordDetails;
