import { useCallback, useState } from 'react';

type useRepairJobDetailsModals = {
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  onOpenEditModal: () => void;
  onCloseEditModal: () => void;
  onOpenDeleteModal: () => void;
  onCloseDeleteModal: () => void;
};

const useRepairJobDetailsModals = (): useRepairJobDetailsModals => {
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const onOpenEditModal = useCallback(() => setIsEditModalOpen(true), []);
  const onCloseEditModal = useCallback(() => setIsEditModalOpen(false), []);

  const onOpenDeleteModal = useCallback(() => setIsDeleteModalOpen(true), []);
  const onCloseDeleteModal = useCallback(() => setIsDeleteModalOpen(false), []);

  return {
    isEditModalOpen,
    isDeleteModalOpen,
    onOpenEditModal,
    onCloseEditModal,
    onOpenDeleteModal,
    onCloseDeleteModal,
  };
};

export default useRepairJobDetailsModals;
