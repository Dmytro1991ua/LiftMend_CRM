import { act, renderHook } from '@testing-library/react-hooks';

import { useModal } from '@/shared/hooks';

describe('useModal', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = () => renderHook(() => useModal());

  it('should return correct initial hook data', () => {
    const { result } = hook();

    expect(result.current.isModalOpen).toBe(false);
  });

  it('should trigger onOpenModal to open modal', () => {
    const { result } = hook();

    act(() => result.current.onOpenModal());

    expect(result.current.isModalOpen).toBe(true);
  });

  it('should trigger onCloseMobileNav to close modal', () => {
    const { result } = hook();

    act(() => result.current.onCloseModal());

    expect(result.current.isModalOpen).toBe(false);
  });
});
