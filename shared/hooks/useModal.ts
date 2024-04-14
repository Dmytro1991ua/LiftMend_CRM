import { useCallback, useState } from 'react';

type UseModal = {
  isModalOpen: boolean;
  onCloseModal: () => void;
  onOpenModal: () => void;
};

export const useModal = (): UseModal => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onCloseModal = useCallback(() => setIsModalOpen(false), []);

  const onOpenModal = useCallback(() => setIsModalOpen(true), []);

  return { isModalOpen, onCloseModal, onOpenModal };
};
