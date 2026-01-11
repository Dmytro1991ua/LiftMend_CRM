import { Dispatch, SetStateAction, useCallback, useState } from 'react';

export type UseDropdownStateProps = {
  isDisabled?: boolean;
};

export type UseDropdownState = {
  isDropdownOpen: boolean;
  onDropdownOpen: () => void;
  onDropdownClose: () => void;
  onHandleDropdownOpenState: (nextOpen: boolean) => void;
  setIsDropdownOpen: Dispatch<SetStateAction<boolean>>;
};

export const useDropdownState = ({ isDisabled = false }: UseDropdownStateProps): UseDropdownState => {
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
