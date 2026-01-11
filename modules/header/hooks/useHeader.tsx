import { Dispatch, SetStateAction, useCallback } from 'react';

import { useRouter } from 'next/router';

import { useSignOut } from '@/shared/auth/hooks';
import { useDropdownOpenState } from '@/shared/repair-job/hooks';
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
  onRedirectToNotificationsPage: () => Promise<boolean>;
};

export const useHeader = (): UseHeader => {
  const router = useRouter();

  const { onSignOut } = useSignOut();
  const { loading: isUnreadNotificationCountLoading, unreadNotificationCount } = useGetUnreadNotificationsCount();

  const { isDropdownOpen, onDropdownOpen, onDropdownClose, setIsDropdownOpen } = useDropdownOpenState({});

  const onHandleSignOut = useCallback(async (): Promise<void> => {
    await onSignOut(AppRoutes.SignOut);

    onDropdownClose();
  }, [onSignOut, onDropdownClose]);

  const onRedirectToNotificationsPage = useCallback(() => router.push(AppRoutes.Notifications), [router]);

  return {
    isDropdownOpen,
    isUnreadNotificationCountLoading,
    unreadNotificationCount,
    onDropdownClose,
    onDropdownOpen,
    onHandleSignOut,
    onSetIsDropdownOpen: setIsDropdownOpen,
    onRedirectToNotificationsPage,
  };
};
