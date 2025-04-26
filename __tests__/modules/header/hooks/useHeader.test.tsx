import { act, renderHook } from '@testing-library/react-hooks';

import { MockProviderHook } from '@/mocks/testMocks';
import { useHeader } from '@/modules/header/hooks';
import { useSignOut } from '@/shared/auth/hooks';

jest.mock('@/shared/auth/hooks');

describe('useHeader', () => {
  const mockOnSignOut = jest.fn();

  beforeEach(() => {
    (useSignOut as jest.Mock).mockReturnValue({
      onSignOut: mockOnSignOut,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = () =>
    renderHook(() => useHeader(), {
      wrapper: ({ children }) => <MockProviderHook mocks={[]}>{children}</MockProviderHook>,
    });

  it('should return correct initial hook data', () => {
    const { result } = hook();

    expect(result.current.isDropdownOpen).toBe(false);
  });

  it('should trigger onDropdownOpen and open the dropdown', () => {
    const { result } = hook();

    act(() => result.current.onDropdownOpen());

    expect(result.current.isDropdownOpen).toBe(true);
  });

  it('should trigger onDropdownClose and close the dropdown', () => {
    const { result } = hook();

    act(() => result.current.onDropdownClose());

    expect(result.current.isDropdownOpen).toBe(false);
  });

  it('should trigger onHandleSignOut and close a dropdown', async () => {
    const { result } = hook();

    await act(async () => result.current.onHandleSignOut());

    expect(mockOnSignOut).toHaveBeenCalled();
    expect(result.current.isDropdownOpen).toBe(false);
  });
});
