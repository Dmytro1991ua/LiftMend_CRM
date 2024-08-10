import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { useToast } from '@/components/ui/use-toast';
import { BaseToastVariant, Variant } from '@/shared/hooks/useBaseToast/types';
import { useBaseToast } from '@/shared/hooks/useBaseToast/useBaseToast';

jest.mock('@/components/ui/use-toast');

describe('useBaseToast', () => {
  const mockToast = jest.fn();

  const hook = (variant: BaseToastVariant) => renderHook(() => useBaseToast(variant));

  beforeEach(() => {
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should trigger baseToast with info variant', () => {
    const mockMessage = 'Info Toast';

    const mockToastVariant = Variant.Info;

    const { result } = hook(BaseToastVariant.Info);

    act(() => result.current.baseToast(mockMessage, ''));

    expect(mockToast).toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledTimes(1);

    const [[callArgs]] = mockToast.mock.calls;

    expect(callArgs.variant).toBe(mockToastVariant);
  });

  it('should trigger baseToast with success variant', () => {
    const mockMessage = 'Success Toast';

    const mockToastVariant = Variant.Success;

    const { result } = hook(BaseToastVariant.Success);

    act(() => result.current.baseToast(mockMessage, ''));

    expect(mockToast).toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledTimes(1);

    const [[callArgs]] = mockToast.mock.calls;

    expect(callArgs.variant).toBe(mockToastVariant);
  });

  it('should trigger baseToast with warning variant', () => {
    const mockMessage = 'Warning Toast';

    const mockToastVariant = Variant.Warning;

    const { result } = hook(BaseToastVariant.Warning);

    act(() => result.current.baseToast(mockMessage, ''));

    expect(mockToast).toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledTimes(1);

    const [[callArgs]] = mockToast.mock.calls;

    expect(callArgs.variant).toBe(mockToastVariant);
  });

  it('should trigger baseToast with error variant', () => {
    const mockMessage = 'Error Toast';

    const mockToastVariant = Variant.Destructive;

    const { result } = hook(BaseToastVariant.Error);

    act(() => result.current.baseToast(mockMessage, ''));

    expect(mockToast).toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledTimes(1);

    const [[callArgs]] = mockToast.mock.calls;

    expect(callArgs.variant).toBe(mockToastVariant);
  });
});
