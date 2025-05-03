import { render, screen } from '@testing-library/react';

import ProfileContentWrapper from '@/modules/profile/profile-content-wrapper/ProfileContentWrapper';
import { ProfileContentSubtitle, ProfileContentTitle } from '@/modules/profile/types';

describe('ProfileContentWrapper', () => {
  it('should render content wrapper for Account Settings block', () => {
    render(
      <ProfileContentWrapper
        subtitle={ProfileContentSubtitle.UserInformation}
        title={ProfileContentTitle.AccountSettings}>
        <p>Account Settings Block</p>
      </ProfileContentWrapper>
    );

    expect(screen.getByText(ProfileContentTitle.AccountSettings)).toBeInTheDocument();
    expect(screen.getByText(ProfileContentSubtitle.UserInformation)).toBeInTheDocument();
    expect(screen.getByText('Account Settings Block')).toBeInTheDocument();
  });

  it('should render content wrapper for Change Password block', () => {
    render(
      <ProfileContentWrapper
        subtitle={ProfileContentSubtitle.PasswordManagement}
        title={ProfileContentTitle.ChangePassword}>
        <p>Change Password Block</p>
      </ProfileContentWrapper>
    );

    expect(screen.getByText(ProfileContentTitle.ChangePassword)).toBeInTheDocument();
    expect(screen.getByText(ProfileContentSubtitle.PasswordManagement)).toBeInTheDocument();
    expect(screen.getByText('Change Password Block')).toBeInTheDocument();
  });
});
