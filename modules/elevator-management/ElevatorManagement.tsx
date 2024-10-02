import { HiPlus } from 'react-icons/hi';

import { Button } from '@/components/ui/button';
import BaseModal from '@/shared/base-modal';
import ModalFooter from '@/shared/base-modal/modal-footer';
import { useModal } from '@/shared/hooks';
import SectionHeader from '@/shared/section-header';
import { SectionHeaderDescription, SectionHeaderTitle } from '@/types/enums';

import ElevatorManagementTable from './components/elevator-management-table';
import { ADD_ELEVATOR_RECORD_BUTTON_LABEL } from './constants';

const ElevatorManagement = (): React.JSX.Element => {
  const { isModalOpen, onCloseModal, onOpenModal } = useModal();

  return (
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
      <BaseModal
        isOpen={isModalOpen}
        modalFooter={
          <ModalFooter
            cancelButtonLabel='Cancel'
            submitButtonLabel='Submit'
            onCancel={onCloseModal}
            onSubmit={onCloseModal}
          />
        }
        title='Create Elevator Record'
        onClose={onCloseModal}
      >
        <p>Test description</p>
      </BaseModal>
    </div>
  );
};

export default ElevatorManagement;
