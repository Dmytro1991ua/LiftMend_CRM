import { render, screen } from '@testing-library/react';

import { withRouterAndApolloProvider } from '@/mocks/testMocks';
import Profile from '@/modules/profile';
import { ProfileContentTitle } from '@/modules/profile/types';
import { AppRoutes, SectionHeaderTitle } from '@/types/enums';

describe('Profile', () => {
  it('should render component without crashing', () => {
    render(withRouterAndApolloProvider(<Profile />, AppRoutes.Profile));

    expect(screen.getByText(SectionHeaderTitle.Profile)).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByTestId('profile-action-buttons')).toBeInTheDocument();
    expect(screen.getByTestId('profile-dropzone')).toBeInTheDocument();
    expect(screen.getByTestId('user-avatar')).toBeInTheDocument();
    expect(screen.getByText(ProfileContentTitle.AccountSettings)).toBeInTheDocument();
    expect(screen.getByText(ProfileContentTitle.ChangePassword)).toBeInTheDocument();
  });
});
