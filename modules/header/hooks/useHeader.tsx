import { useCallback, useState } from 'react';

import { useSignOut } from '@/shared/auth/hooks';

type UseHeader = {
  isDropdownOpen: boolean;
  onDropdownClose: () => void;
  onDropdownOpen: () => void;
  onHandleSignOut: () => Promise<void>;
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
    await onSignOut();

    onDropdownClose();
  }, [onSignOut, onDropdownClose]);

  return {
    isDropdownOpen,
    onDropdownClose,
    onDropdownOpen,
    onHandleSignOut,
  };
};
