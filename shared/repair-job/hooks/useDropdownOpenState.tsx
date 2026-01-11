import { Dispatch, SetStateAction, useCallback, useState } from 'react';

export type UseDropdownOpenStateProps = {
  isDisabled?: boolean;
};

export type UseDropdownOpenState = {
  isDropdownOpen: boolean;
  onDropdownOpen: () => void;
  onDropdownClose: () => void;
  onHandleDropdownOpenState: (nextOpen: boolean) => void;
  setIsDropdownOpen: Dispatch<SetStateAction<boolean>>;
};

export const useDropdownOpenState = ({ isDisabled = false }: UseDropdownOpenStateProps): UseDropdownOpenState => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const onHandleDropdownOpenState = useCallback(
    (nextOpen: boolean): void => {
      if (isDisabled) return;

      setIsDropdownOpen(nextOpen);
    },
    [isDisabled]
  );

  const onDropdownOpen = useCallback((): void => {
    setIsDropdownOpen(true);
  }, []);

  const onDropdownClose = useCallback((): void => {
    setIsDropdownOpen(false);
  }, []);

  return {
    isDropdownOpen,
    onHandleDropdownOpenState,
    onDropdownClose,
    onDropdownOpen,
    setIsDropdownOpen,
  };
};
