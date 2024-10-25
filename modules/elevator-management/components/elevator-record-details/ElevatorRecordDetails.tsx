import React, { useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { FormProvider } from 'react-hook-form';

import BaseDetailsPage from '@/shared/base-details-page';
import useDetailsPageModals from '@/shared/base-details-page/hooks/useDetailsPageModals';
import EditModal from '@/shared/base-modal/edit-modal';
import { getModalTitle } from '@/shared/base-modal/edit-modal/utils';
import useFormState from '@/shared/hooks/useFormState';
import { getElevatorRecordInfo } from '@/shared/utils';

import { ElevatorRecordFormValues } from '../../types';
import { convertElevatorRecordToFormValues } from '../../utils';
import EditElevatorRecordForm from '../edit-elevator-record-form';
import { elevatorRecordEditFormSchema } from '../edit-elevator-record-form/validation';
import useEditElevatorRecordForm from '../elevator-record-form/hooks/useEditElevatorRecordForm';

import { elevatorRecordSectionsConfig } from './config';
import useFetchElevatorRecordById from './hooks/useFetchElevatorRecordById';

const ElevatorRecordDetails = () => {
  const {
    query: { elevatorRecordId },
    back,
  } = useRouter();

  const { elevatorRecord, loading, error } = useFetchElevatorRecordById(elevatorRecordId as string);

  const {
    isEditModalOpen,
    isDeleteModalOpen,
    onCloseEditModal,
    onOpenEditModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
  } = useDetailsPageModals();

  const currentRepairJob = useMemo(() => convertElevatorRecordToFormValues(elevatorRecord), [elevatorRecord]);

  const elevatorRecordSections = useMemo(() => elevatorRecordSectionsConfig(elevatorRecord), [elevatorRecord]);

  const { title, description } = useMemo(() => getElevatorRecordInfo(elevatorRecord), [elevatorRecord]);

  const { formState, onReset } = useFormState<ElevatorRecordFormValues>({
    initialValues: currentRepairJob,
    onCloseModal: onCloseEditModal,
    resolver: zodResolver(elevatorRecordEditFormSchema),
  });

  const { isUpdateRecordLoading, onEditElevatorRecord } = useEditElevatorRecordForm({ onReset, elevatorRecord });

  const ELEVATOR_RECORD_DETAILS_MODALS_CONFIG = [
    {
      id: 1,
      content: (
        <EditModal
          isDisabled={!formState.formState.isDirty || isUpdateRecordLoading}
          isOpen={isEditModalOpen}
          title={getModalTitle(title, true)}
          onClose={onReset}
          onSubmit={formState.handleSubmit(onEditElevatorRecord)}
        >
          <EditElevatorRecordForm elevatorRecord={elevatorRecord} />
        </EditModal>
      ),
    },
  ];

  return (
    <FormProvider {...formState}>
      <BaseDetailsPage
        description={description}
        detailsPageSections={elevatorRecordSections}
        error={error}
        errorMessage={`Failed to fetch Elevator Record Details by ${elevatorRecordId}`}
        loading={loading}
        modalConfig={ELEVATOR_RECORD_DETAILS_MODALS_CONFIG}
        title={title}
        onOpenDeleteModal={onOpenDeleteModal}
        onOpenEditModal={onOpenEditModal}
      />
    </FormProvider>
  );
};

export default ElevatorRecordDetails;
