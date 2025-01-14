import { useCallback, useState } from 'react';

type UseDetailsPageModals = {
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  onOpenEditModal: () => void;
  onCloseEditModal: () => void;
  onOpenDeleteModal: () => void;
  onCloseDeleteModal: () => void;
};

const useDetailsPageModals = (): UseDetailsPageModals => {
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

export default useDetailsPageModals;
