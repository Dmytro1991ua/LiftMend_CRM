import { useCallback, useState } from 'react';

type useRepairJobDetailsModals = {
  isEditModalOpen: boolean;
  onOpenEditModal: () => void;
  onCloseEditModal: () => void;
};

const useRepairJobDetailsModals = (): useRepairJobDetailsModals => {
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const onOpenEditModal = useCallback(() => setIsEditModalOpen(true), []);
  const onCloseEditModal = useCallback(() => setIsEditModalOpen(false), []);

  return {
    isEditModalOpen,
    onOpenEditModal,
    onCloseEditModal,
  };
};

export default useRepairJobDetailsModals;
