import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ProfileActionButtons, {
  ProfileActionButtonsProps,
} from '@/modules/profile/profile-action-buttons/ProfileActionButtons';
import { ProfileFormButtonLabel } from '@/modules/profile/types';

describe('ProfileActionButtons', () => {
  const mockOnReset = jest.fn();
  const mockOnSubmit = jest.fn();

  const defaultProps: ProfileActionButtonsProps = {
    isLoading: false,
    isDisabled: false,
    onReset: mockOnReset,
    onSubmit: mockOnSubmit,
    onDeleteAccount: jest.fn(),
  };

  const ProfileActionButtonsComponent = (props?: Partial<ProfileActionButtonsProps>) => (
    <ProfileActionButtons {...defaultProps} {...props} />
  );

  it('should render component without crashing', () => {
    render(ProfileActionButtonsComponent());

    expect(screen.getByTestId('profile-action-buttons')).toBeInTheDocument();
    expect(screen.getByText(ProfileFormButtonLabel.DiscardChanges)).toBeInTheDocument();
    expect(screen.getByText(ProfileFormButtonLabel.UpdateProfile)).toBeInTheDocument();
  });

  it('should correctly render and handle Discard Changes button', async () => {
    render(ProfileActionButtonsComponent());

    const discardChanges = screen.getByText(ProfileFormButtonLabel.DiscardChanges);

    await userEvent.click(discardChanges);

    await waitFor(() => expect(mockOnReset).toHaveBeenCalled());
  });

  it('should correctly render and handle Update Profile button', async () => {
    render(ProfileActionButtonsComponent());

    const discardChanges = screen.getByText(ProfileFormButtonLabel.UpdateProfile);

    await userEvent.click(discardChanges);

    await waitFor(() => expect(mockOnSubmit).toHaveBeenCalled());
  });
});
