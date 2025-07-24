import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { useMobileNavigation } from '@/shared/hooks/useMobileNavigation';

describe('useMobileNavigation', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = () => renderHook(() => useMobileNavigation());

  it('should return correct initial hook data', () => {
    const { result } = hook();

    expect(result.current.isMobileNavOpen).toBe(false);
  });

  it('should trigger onOpenMobileNav to open mobile navigation', () => {
    const { result } = hook();

    act(() => result.current.onOpenMobileNav());

    expect(result.current.isMobileNavOpen).toBe(true);
  });

  it('should trigger onCloseMobileNav to close mobile navigation', () => {
    const { result } = hook();

    act(() => result.current.onCloseMobileNav());

    expect(result.current.isMobileNavOpen).toBe(false);
  });
});
