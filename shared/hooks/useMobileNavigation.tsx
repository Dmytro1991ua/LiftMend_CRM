import { useCallback, useState } from 'react';

type UseMobileNavigation = {
  isMobileNavOpen: boolean;
  onOpenMobileNav: () => void;
  onCloseMobileNav: () => void;
};

export const useMobileNavigation = (): UseMobileNavigation => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const onOpenMobileNav = useCallback(() => {
    setIsMobileNavOpen(true);
  }, []);

  const onCloseMobileNav = useCallback(() => {
    setIsMobileNavOpen(false);
  }, []);

  return {
    isMobileNavOpen,
    onOpenMobileNav,
    onCloseMobileNav,
  };
};
