import { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';

const LOADER_DELAY = 150;
const MIN_LOADER_TIME = 300;

export const useNavigationLoading = (): boolean => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Refs to store timeouts and prevent unnecessary re-renders
  const startTimeout = useRef<NodeJS.Timeout | null>(null);
  const endTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Delays loader to prevent flickering
    const handleRouteChangeStart = () => (startTimeout.current = setTimeout(() => setIsLoading(true), LOADER_DELAY));

    const handleRouteChangeComplete = () => {
      // Clear start timeout if navigation completes quickly
      if (startTimeout.current) clearTimeout(startTimeout.current);

      // Ensure loader stays visible for a minimum time
      if (isLoading) {
        endTimeout.current = setTimeout(() => setIsLoading(false), MIN_LOADER_TIME);
      } else {
        setIsLoading(false);
      }
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeComplete);

    return () => {
      if (startTimeout.current) clearTimeout(startTimeout.current);
      if (endTimeout.current) clearTimeout(endTimeout.current);

      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeComplete);
    };
  }, [router, isLoading]);

  return isLoading;
};
