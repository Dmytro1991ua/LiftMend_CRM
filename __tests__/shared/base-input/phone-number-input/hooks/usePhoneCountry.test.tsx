import { act } from '@testing-library/react';
import { RenderHookResult, renderHook } from '@testing-library/react-hooks';

import { usePhoneCountry, usePhoneCountryResult } from '@/shared/base-input/phone-number-input/hooks';

describe('usePhoneCountry', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (): RenderHookResult<unknown, usePhoneCountryResult> => renderHook(() => usePhoneCountry());

  it('should return correct initial hook data', () => {
    const { result } = hook();

    expect(result.current.selectedCountry).toEqual('us');
  });

  it('should trigger onSelectCountry and correctly select country', () => {
    const { result } = hook();

    act(() => result.current.onSelectCountry('vn'));

    expect(result.current.selectedCountry).toEqual('vn');
  });

  it('should trigger onResetPhoneInputCountry and recent country to default', () => {
    const { result } = hook();

    act(() => result.current.onResetPhoneInputCountry());

    expect(result.current.selectedCountry).toEqual('us');
  });
});
