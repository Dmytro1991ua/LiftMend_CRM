import { HiPlus } from 'react-icons/hi';

import { Button } from '@/components/ui/button';
import BaseModal from '@/shared/base-modal';
import ModalFooter from '@/shared/base-modal/modal-footer';
import { useModal } from '@/shared/hooks';
import SectionHeader from '@/shared/section-header';
import { SectionHeaderTitle } from '@/types/enums';

import ElevatorManagementTable from './elevator-management-table';

const ElevatorManagement = (): React.JSX.Element => {
  const { isModalOpen, onCloseModal, onOpenModal } = useModal();

  //TODO: Example on how to use actionComponent for SectionHeader
  const sectionHeaderButton = (
    <Button onClick={onOpenModal}>
      <HiPlus />
      <span className='ml-2'>Add Task</span>
    </Button>
  );

  return (
    <div className='flex flex-col'>
      <SectionHeader actionComponent={sectionHeaderButton} title={SectionHeaderTitle.ElevatorManagement} />
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
        title='Create Elevator Details'
        onClose={onCloseModal}
      >
        <p>Test description</p>
      </BaseModal>
    </div>
  );
};

export default ElevatorManagement;
