import { InMemoryCache } from '@apollo/client';
import { RenderHookResult, renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import { useForm } from 'react-hook-form';

import { typePolicies } from '@/graphql/typePolicies';
import { mockFormState } from '@/mocks/formStateMock';
import { mockDeleteUserAccountResponse, mockUpdateProfileResponse } from '@/mocks/profileMocks';
import { MockProviderHook } from '@/mocks/testMocks';
import { mockUser, mockUserResponse } from '@/mocks/userMocks';
import { UseProfileResult, useDeleteAccount, useProfile } from '@/modules/profile/hooks';
import { useSignOut } from '@/shared/auth/hooks';
import { usePhoneCountry } from '@/shared/base-input/phone-number-input/hooks';
import { useGetUser } from '@/shared/hooks';

jest.mock('@/modules/profile/hooks', () => ({
  ...jest.requireActual('@/modules/profile/hooks'),
  useDeleteAccount: jest.fn(),
}));
jest.mock('react-hook-form');
jest.mock('@/shared/hooks', () => ({
  ...jest.requireActual('@/shared/hooks'),
  useGetUser: jest.fn(),
}));
jest.mock('@/shared/base-input/phone-number-input/hooks');
jest.mock('@/shared/auth/hooks', () => ({
  ...jest.requireActual('@/shared/auth/hooks'),
  useSignOut: jest.fn(),
}));

describe('useProfile', () => {
  const mockOnReset = jest.fn();
  const mockOnClearErrors = jest.fn();
  const mockOnSelectCountry = jest.fn();
  const mockOnResetPhoneInputCountry = jest.fn();
  const mockOnDeleteAccount = jest.fn();
  const mockOnSignOut = jest.fn();
  const mockFormValues = {
    firstName: 'Mike',
    lastName: 'Smith',
    email: 'test@gmail.com',
    newPassword: '',
    currentPassword: '',
    confirmPassword: '',
    phoneNumber: '+380667877777',
  };

  beforeEach(() => {
    (useForm as jest.Mock).mockReturnValue(mockFormState);
    (useGetUser as jest.Mock).mockReturnValue({
      user: mockUser,
      loading: false,
    });
    (usePhoneCountry as jest.Mock).mockReturnValue({
      selectedCountry: 'us',
      onSelectCountry: mockOnSelectCountry,
      onResetPhoneInputCountry: mockOnResetPhoneInputCountry,
    });
    (useDeleteAccount as jest.Mock).mockReturnValue({
      loading: false,
      onDeleteAccount: mockOnDeleteAccount,
    });
    (useSignOut as jest.Mock).mockReturnValue({
      onSignOut: mockOnSignOut,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (): RenderHookResult<unknown, UseProfileResult> => {
    const cache = new InMemoryCache({
      addTypename: false,
      typePolicies,
    });

    return renderHook(() => useProfile(), {
      wrapper: ({ children }) => (
        <MockProviderHook
          cache={cache}
          mocks={[mockUserResponse, mockUpdateProfileResponse, mockDeleteUserAccountResponse]}>
          {children}
        </MockProviderHook>
      ),
    });
  };

  it('should return correct initial hook data', async () => {
    const { result } = hook();

    expect(result.current.loading).toBe(false);
    expect(result.current.selectedCountry).toBe('us');
    expect(result.current.user).toBe(mockUser);
  });

  it('should trigger onReset, clearErrors, and reset form', () => {
    (useForm as jest.Mock).mockReturnValue({ ...mockFormState, reset: mockOnReset, clearErrors: mockOnClearErrors });

    const { result } = hook();

    act(() => result.current.onReset());

    expect(mockOnReset).toHaveBeenCalled();
    expect(mockOnClearErrors).toHaveBeenCalled();
  });

  it('should trigger onSubmit, update profile, and reset phone input country', async () => {
    const { result } = hook();

    await act(async () => {
      await result.current.onSubmit(mockFormValues);
    });

    expect(mockOnResetPhoneInputCountry).toHaveBeenCalled();
    expect(result.current.updateProfileLoading).toBe(false);
  });

  it('should trigger onHandleDeleteAccount, sign user out, delete account and close a modal', async () => {
    const { result } = hook();

    await act(async () => {
      await result.current.onHandleDeleteAccount();
    });

    expect(mockOnSignOut).toHaveBeenCalled();
    expect(result.current.isDeleteAccountLoading).toBe(false);
    expect(result.current.isModalOpen).toBe(false);
  });
});
