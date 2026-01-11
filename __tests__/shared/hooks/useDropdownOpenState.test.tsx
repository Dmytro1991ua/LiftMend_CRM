import { act, renderHook } from '@testing-library/react-hooks';

import { UseDropdownStateProps, useDropdownState } from '@/shared/hooks';

describe('useDropdownState', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    isDisabled: false,
  };

  const hook = (props: Partial<UseDropdownStateProps>) =>
    renderHook(() => useDropdownState({ ...defaultProps, ...props }));

  it('should initialize with isDropdownOpen false', () => {
    const { result } = hook({});

    expect(result.current.isDropdownOpen).toBe(false);
  });

  it('should open the dropdown', () => {
    const { result } = hook({});

    act(() => {
      result.current.onDropdownOpen();
    });

    expect(result.current.isDropdownOpen).toBe(true);
  });

  it('should close the dropdown', () => {
    const { result } = hook({});

    act(() => {
      result.current.onDropdownOpen();
    });

    expect(result.current.isDropdownOpen).toBe(true);

    act(() => {
      result.current.onDropdownClose();
    });

    expect(result.current.isDropdownOpen).toBe(false);
  });

  it('should not change dropdown state when disabled', () => {
    const { result } = hook({ isDisabled: true });

    act(() => {
      result.current.onHandleDropdownOpenState(true);
    });
    expect(result.current.isDropdownOpen).toBe(false);

    act(() => {
      result.current.onHandleDropdownOpenState(false);
    });
    expect(result.current.isDropdownOpen).toBe(false);
  });
});
