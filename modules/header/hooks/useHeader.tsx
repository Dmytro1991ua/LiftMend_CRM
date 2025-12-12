import { Dispatch, SetStateAction, useCallback, useState } from 'react';

import { useSignOut } from '@/shared/auth/hooks';
import { AppRoutes } from '@/types/enums';

import { useGetUnreadNotificationsCount } from './useGetUnreadNotificationCount';

type UseHeader = {
  isDropdownOpen: boolean;
  isUnreadNotificationCountLoading: boolean;
  unreadNotificationCount: number;
  onDropdownClose: () => void;
  onDropdownOpen: () => void;
  onHandleSignOut: () => Promise<void>;
  onSetIsDropdownOpen: Dispatch<SetStateAction<boolean>>;
};

export const useHeader = (): UseHeader => {
  const { onSignOut } = useSignOut();
  const { loading: isUnreadNotificationCountLoading, unreadNotificationCount } = useGetUnreadNotificationsCount();

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
    isUnreadNotificationCountLoading,
    unreadNotificationCount,
    onDropdownClose,
    onDropdownOpen,
    onHandleSignOut,
    onSetIsDropdownOpen: setIsDropdownOpen,
  };
};
