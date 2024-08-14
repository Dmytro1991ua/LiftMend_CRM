import { BaseToastVariant } from './useBaseToast/types';
import { useBaseToast } from './useBaseToast/useBaseToast';

type UseMutationResultToasts = {
  onSuccess: (message: string) => void;
  onError: (message: string, description: string) => void;
};

const useMutationResultToasts = (): UseMutationResultToasts => {
  const { baseToast: successBaseToast } = useBaseToast(BaseToastVariant.Success);
  const { baseToast: errorBaseToast } = useBaseToast(BaseToastVariant.Error);

  const onSuccess = (message: string) => {
    successBaseToast(message, '');
  };

  const onError = (message: string, description: string) => {
    errorBaseToast(message, description);
  };

  return {
    onSuccess,
    onError,
  };
};

export default useMutationResultToasts;
