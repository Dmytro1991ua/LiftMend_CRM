import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider } from 'react-hook-form';
import { HiPlus } from 'react-icons/hi';

import { Button } from '@/components/ui/button';
import BaseModal from '@/shared/base-modal';
import { useModal } from '@/shared/hooks';
import useFormState from '@/shared/hooks/useFormState';
import SectionHeader from '@/shared/section-header';
import { SectionHeaderDescription, SectionHeaderTitle } from '@/types/enums';

import ElevatorManagementTable from './components/elevator-management-table';
import ElevatorRecordForm from './components/elevator-record-form';
import {
  ElevatorRecordFormFields,
  INITIAL_ELEVATOR_RECORD_FORM_VALUES,
  elevatorRecordFormSchema,
} from './components/elevator-record-form/validation';
import { ADD_ELEVATOR_RECORD_BUTTON_LABEL } from './constants';

const ElevatorManagement = (): React.JSX.Element => {
  const { isModalOpen, onCloseModal, onOpenModal } = useModal();

  const { formState, onReset } = useFormState<ElevatorRecordFormFields>({
    initialValues: INITIAL_ELEVATOR_RECORD_FORM_VALUES,
    onCloseModal: onCloseModal,
    resolver: zodResolver(elevatorRecordFormSchema),
  });

  return (
    <FormProvider {...formState}>
      <div className='flex flex-col'>
        <SectionHeader
          actionComponent={
            <Button onClick={onOpenModal}>
              <HiPlus />
              <span className='ml-2'>{ADD_ELEVATOR_RECORD_BUTTON_LABEL}</span>
            </Button>
          }
          subtitle={SectionHeaderDescription.ElevatorManagement}
          title={SectionHeaderTitle.ElevatorManagement}
        />
        <div className='content-wrapper'>
          <ElevatorManagementTable />
        </div>
        <BaseModal isOpen={isModalOpen} title='Create Elevator Record' onClose={onReset}>
          <ElevatorRecordForm onReset={onReset} />
        </BaseModal>
      </div>
    </FormProvider>
  );
};

export default ElevatorManagement;
