import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as form from 'react-hook-form';
import { UseFormReturn } from 'react-hook-form';

import { mockFormState } from '@/mocks/formStateMock';
import { withFormProvider } from '@/mocks/testMocks';
import { PROFILE_CHANGE_PASSWORD_SETTINGS_CONFIG } from '@/modules/profile/configs';
import ProfileFormFields from '@/modules/profile/profile-form-fields';
import { ProfileFormFieldsProps } from '@/modules/profile/profile-form-fields/ProfileFormFields';

describe('ProfileFormFields', () => {
  const mockOnClearErrors = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    config: PROFILE_CHANGE_PASSWORD_SETTINGS_CONFIG,
    selectedCountry: 'us',
    onSelectCountry: jest.fn(),
  };

  const ProfileFormFieldsComponent = (props?: Partial<ProfileFormFieldsProps>) =>
    withFormProvider(<ProfileFormFields {...defaultProps} {...props} />);

  it('should render component without crashing', () => {
    render(ProfileFormFieldsComponent());

    expect(screen.getByTestId('profile-form-fields')).toBeInTheDocument();
    expect(screen.getByText('Current Password')).toBeInTheDocument();
    expect(screen.getByText('New Password')).toBeInTheDocument();
    expect(screen.getByText('Confirm Password')).toBeInTheDocument();
  });

  it('should render phone number input if config has phone input type', () => {
    render(
      ProfileFormFieldsComponent({
        config: [
          {
            id: 4,
            name: 'phoneNumber',
            label: 'Phone Number',
            placeholder: 'Enter your phone number',
            isLastElement: true,
            type: 'phone',
          },
        ],
      })
    );

    expect(screen.getByText('Phone')).toBeInTheDocument();
  });

  it('should trigger clearErrors on input change', async () => {
    jest.spyOn(form, 'useFormContext').mockReturnValue({
      formState: {
        ...mockFormState.formState,
      },
      clearErrors: mockOnClearErrors,
      register: jest.fn().mockReturnValue({ onChange: mockOnClearErrors }),
    } as unknown as UseFormReturn);

    render(ProfileFormFieldsComponent());

    const currentPasswordInput = screen.getByPlaceholderText(/Enter your current password/i) as HTMLInputElement;

    await userEvent.type(currentPasswordInput, 'TestPassword123');

    expect(currentPasswordInput.value).toBe('TestPassword123');
    expect(mockOnClearErrors).toHaveBeenCalled();
  });
});
