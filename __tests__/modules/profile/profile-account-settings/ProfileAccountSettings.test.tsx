import { render, screen } from '@testing-library/react';

import { mockUpdateProfilePictureResponse } from '@/mocks/profileMocks';
import { withApolloAndFormProvider } from '@/mocks/testMocks';
import { mockUser } from '@/mocks/userMocks';
import ProfileAccountSettings, {
  ProfileAccountSettingsProps,
} from '@/modules/profile/profile-account-settings/ProfileAccountSettings';

describe('ProfileAccountSettings', () => {
  const defaultProps: ProfileAccountSettingsProps = {
    user: mockUser,
    isLoading: false,
    selectedCountry: 'us',
    onSelectCountry: jest.fn(),
  };

  const ProfileAccountSettingsComponent = (props?: Partial<ProfileAccountSettingsProps>) =>
    withApolloAndFormProvider(<ProfileAccountSettings {...defaultProps} {...props} />, [
      mockUpdateProfilePictureResponse,
    ]);

  it('should render component without crashing', () => {
    render(ProfileAccountSettingsComponent());

    expect(screen.getByTestId('profile-dropzone')).toBeInTheDocument();
    expect(screen.getByTestId('user-avatar')).toBeInTheDocument();
    expect(screen.getByTestId('profile-form-fields')).toBeInTheDocument();
  });

  it('should show loader when isLoading is true', () => {
    render(ProfileAccountSettingsComponent({ isLoading: true }));

    expect(screen.getByTestId('bars-loading')).toBeInTheDocument();
  });
});
