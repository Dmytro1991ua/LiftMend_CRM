import { useRef } from 'react';

import { useBaseToast } from '../hooks';
import { BaseToastVariant } from '../hooks/useBaseToast/types';

type QueryResponseProps = {
  loading?: boolean;
  errorMessage?: string;
  errorDescription?: string;
  loadingComponent?: JSX.Element;
  errorComponent?: JSX.Element;
};

const QueryResponse = ({
  loading,
  loadingComponent,
  errorComponent,
  errorMessage = '',
  errorDescription = '',
}: QueryResponseProps): JSX.Element | null => {
  const { baseToast } = useBaseToast(BaseToastVariant.Error);

  const hasShownError = useRef<boolean>(false);

  if (loading) {
    return <>{loadingComponent}</>;
  }

  if (errorDescription) {
    // If error component is provided, render it and prevent showing the toast
    if (errorComponent) {
      return <>{errorComponent}</>;
    }

    // Show toast if no custom error component is provided
    if (!hasShownError.current) {
      baseToast(errorMessage, errorDescription);
      hasShownError.current = true; // Mark the error as shown to prevent multiple toasts
    }

    return null; // No custom error component, but error description exists
  }

  return null;
};

export default QueryResponse;
