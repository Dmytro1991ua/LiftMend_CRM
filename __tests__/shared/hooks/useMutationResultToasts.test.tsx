import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { BaseToastVariant } from '@/shared/hooks/useBaseToast/types';
import useMutationResultToasts from '@/shared/hooks/useMutationResultToasts';

const mockSuccessToast = jest.fn();
const mockErrorToast = jest.fn();

jest.mock('@/shared/hooks/useBaseToast/useBaseToast', () => ({
  useBaseToast: jest.fn((variant) => {
    if (variant === BaseToastVariant.Success) return { baseToast: mockSuccessToast };
    if (variant === BaseToastVariant.Error) return { baseToast: mockErrorToast };

    return { baseToast: jest.fn() };
  }),
}));

describe('useMutationResultToasts', () => {
  const mockSuccessMassage = 'Test success message';
  const mockSuccessDescription = 'Test success description';
  const mockErrorMassage = 'Test error message';
  const mockErrorDescription = 'Test error description';

  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = () => renderHook(() => useMutationResultToasts());

  it('should trigger onSuccess handler and call success alert with message', async () => {
    const { result } = hook();

    act(() => result.current.onSuccess(mockSuccessMassage));

    expect(mockSuccessToast).toHaveBeenCalledWith(mockSuccessMassage, '');
  });

  it('should trigger onSuccess handler and call success alert with message and description (if provided)', () => {
    const { result } = hook();

    act(() => result.current.onSuccess(mockSuccessMassage, mockSuccessDescription));

    expect(mockSuccessToast).toHaveBeenCalledWith(mockSuccessMassage, mockSuccessDescription);
  });

  it('should trigger onError handler and call error alert', () => {
    const { result } = hook();

    act(() => result.current.onError(mockErrorMassage, mockErrorDescription));

    expect(mockErrorToast).toHaveBeenCalledWith(mockErrorMassage, mockErrorDescription);
  });
});
