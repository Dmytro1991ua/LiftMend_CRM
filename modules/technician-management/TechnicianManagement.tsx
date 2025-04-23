import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider } from 'react-hook-form';
import { HiPlus } from 'react-icons/hi';

import { Button } from '@/components/ui/button';
import BaseModal from '@/shared/base-modal';
import { useFormState, useModal } from '@/shared/hooks';
import SectionHeader from '@/shared/section-header';
import { SectionHeaderDescription, SectionHeaderTitle } from '@/types/enums';

import TechnicianManagementTable from './components/technician-management-table';
import TechnicianRecordForm from './components/technician-record-form';
import {
  INITIAL_TECHNICIAN_RECORD_FORM_VALUES,
  TechnicianRecordFormFields,
  technicianRecordFormSchema,
} from './components/technician-record-form/validation';
import { ADD_TECHNICIAN_RECORD_BUTTON_LABEL, CREATE_NEW_TECHNICIAN_MODAL_TITLE } from './constants';

const TechnicianManagement = () => {
  const { isModalOpen, onCloseModal, onOpenModal } = useModal();

  const { formState, onReset } = useFormState<TechnicianRecordFormFields>({
    initialValues: INITIAL_TECHNICIAN_RECORD_FORM_VALUES,
    onCloseModal: onCloseModal,
    resolver: zodResolver(technicianRecordFormSchema),
  });

  return (
    <FormProvider {...formState}>
      <section>
        <SectionHeader
          actionComponent={
            <Button onClick={onOpenModal}>
              <HiPlus />
              <span className='ml-2'>{ADD_TECHNICIAN_RECORD_BUTTON_LABEL}</span>
            </Button>
          }
          subtitle={SectionHeaderDescription.TechnicianManagement}
          title={SectionHeaderTitle.TechnicianManagement}
        />
        <div className='content-wrapper'>
          <TechnicianManagementTable />
        </div>
        <BaseModal isOpen={isModalOpen} title={CREATE_NEW_TECHNICIAN_MODAL_TITLE} onClose={onCloseModal}>
          <TechnicianRecordForm onReset={onReset} />
        </BaseModal>
      </section>
    </FormProvider>
  );
};

export default TechnicianManagement;
