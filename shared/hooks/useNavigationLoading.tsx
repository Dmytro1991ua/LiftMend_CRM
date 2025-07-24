import { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';

const LOADER_DELAY = 150;
const MIN_LOADER_TIME = 300;

export const useNavigationLoading = (): boolean => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Ref to always keep track of latest isLoading value
  const isLoadingRef = useRef(isLoading);

  // Refs to store timeouts and prevent unnecessary re-renders
  const startTimeout = useRef<NodeJS.Timeout | null>(null);
  const endTimeout = useRef<NodeJS.Timeout | null>(null);

  // Update ref whenever isLoading changes
  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    // Delays loader to prevent flickering
    const handleRouteChangeStart = () => {
      startTimeout.current = setTimeout(() => setIsLoading(true), LOADER_DELAY);
    };

    const handleRouteChangeComplete = () => {
      // Clear start timeout if navigation completes quickly
      if (startTimeout.current) {
        clearTimeout(startTimeout.current);
        startTimeout.current = null;
      }

      // Use the ref to check latest isLoading state, not the stale closure variable
      if (isLoadingRef.current) {
        endTimeout.current = setTimeout(() => setIsLoading(false), MIN_LOADER_TIME);
      } else {
        setIsLoading(false);
      }
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeComplete);

    return () => {
      if (startTimeout.current) {
        clearTimeout(startTimeout.current);
      }

      if (endTimeout.current) {
        clearTimeout(endTimeout.current);
      }

      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeComplete);
    };
  }, [router, isLoading]);

  return isLoading;
};
