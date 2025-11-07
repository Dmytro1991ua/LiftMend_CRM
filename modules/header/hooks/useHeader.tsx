import { Dispatch, SetStateAction, useCallback, useState } from 'react';

import { useSignOut } from '@/shared/auth/hooks';
import { AppRoutes } from '@/types/enums';

type UseHeader = {
  isDropdownOpen: boolean;
  onDropdownClose: () => void;
  onDropdownOpen: () => void;
  onHandleSignOut: () => Promise<void>;
  onSetIsDropdownOpen: Dispatch<SetStateAction<boolean>>;
};

export const useHeader = (): UseHeader => {
  const { onSignOut } = useSignOut();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const onDropdownOpen = useCallback((): void => {
    setIsDropdownOpen(true);
  }, []);

  const onDropdownClose = useCallback((): void => {
    setIsDropdownOpen(false);
  }, []);

  const onHandleSignOut = useCallback(async (): Promise<void> => {
    await onSignOut(AppRoutes.SignOut);

    onDropdownClose();
  }, [onSignOut, onDropdownClose]);

  return {
    isDropdownOpen,
    onDropdownClose,
    onDropdownOpen,
    onHandleSignOut,
    onSetIsDropdownOpen: setIsDropdownOpen,
  };
};
