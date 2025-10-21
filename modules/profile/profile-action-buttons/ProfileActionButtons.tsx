import { CiSaveDown1 } from 'react-icons/ci';
import { VscDiscard } from 'react-icons/vsc';
import { FiUserX } from 'react-icons/fi';

import BaseButton from '@/shared/base-button';

import { ProfileActionButtonConfig, ProfileFormButtonLabel } from '../types';

export type ProfileActionButtonsProps = {
  isLoading?: boolean;
  isDisabled?: boolean;
  onReset: () => void;
  onSubmit: () => Promise<void> | void;
  onDeleteAccount: () => Promise<void> | void;
};

const ProfileActionButtons = ({
  isDisabled,
  isLoading,
  onReset,
  onDeleteAccount,
  onSubmit,
}: ProfileActionButtonsProps) => {
  const PROFILE_ACTION_BUTTONS_CONFIG: ProfileActionButtonConfig[] = [
    {
      id: 1,
      icon: <FiUserX size={20} />,
      label: ProfileFormButtonLabel.DeleteAccount,
      onClick: onDeleteAccount,
      isDisabled: false,
      variant: 'default',
      type: 'button',
      className: 'bg-red-500 text-white hover:bg-red-600',
    },
    {
      id: 2,
      icon: <VscDiscard size={20} />,
      label: ProfileFormButtonLabel.DiscardChanges,
      onClick: onReset,
      isDisabled,
      variant: 'ghost',
      type: 'button',
      className: 'text-primary hover:text-primary hover:bg-transparent',
    },
    {
      id: 3,
      icon: <CiSaveDown1 size={20} />,
      label: ProfileFormButtonLabel.UpdateProfile,
      onClick: onSubmit,
      isDisabled,
      isLoading,
      variant: 'default',
      type: 'submit',
    },
  ];
  return (
    <section className='flex gap-2' data-testid='profile-action-buttons'>
      {PROFILE_ACTION_BUTTONS_CONFIG.map(
        ({ id, icon, type, isDisabled, isLoading, label, variant, className, onClick }) => (
          <BaseButton
            key={id}
            className={className}
            icon={icon}
            isDisabled={isDisabled}
            isLoading={isLoading}
            label={label}
            type={type}
            variant={variant}
            onClick={onClick}
          />
        )
      )}
    </section>
  );
};

export default ProfileActionButtons;
