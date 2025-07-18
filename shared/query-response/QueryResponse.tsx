import { useRef } from 'react';

import { useBaseToast } from '../hooks';
import { BaseToastVariant } from '../hooks/useBaseToast/types';

export type QueryResponseProps = {
  loading?: boolean;
  errorMessage?: string;
  errorDescription?: string;
  loadingComponent?: JSX.Element;
  errorComponent?: JSX.Element;
  isErrorOccurred?: boolean;
};

const QueryResponse = ({
  loading,
  loadingComponent,
  errorComponent,
  errorMessage = '',
  errorDescription = '',
  isErrorOccurred,
}: QueryResponseProps): JSX.Element | null => {
  const { baseToast } = useBaseToast(BaseToastVariant.Error);

  const hasShownError = useRef<boolean>(false);

  if (loading) {
    return <>{loadingComponent}</>;
  }

  // If error component is provided, render it and prevent showing the toast
  if (isErrorOccurred && errorComponent) {
    return <>{errorComponent}</>;
  }

  if (isErrorOccurred && (errorMessage || errorDescription) && !errorComponent) {
    // Show toast if no custom error component is provided
    if (!hasShownError.current) {
      baseToast(errorMessage, errorDescription);
      hasShownError.current = true; // Mark the error as shown to prevent multiple toasts
    }
  }

  return null;
};

export default QueryResponse;
