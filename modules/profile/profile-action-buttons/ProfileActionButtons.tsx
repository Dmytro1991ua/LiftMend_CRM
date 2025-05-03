import { CiSaveDown1 } from 'react-icons/ci';
import { VscDiscard } from 'react-icons/vsc';

import BaseButton from '@/shared/base-button';

import { ProfileActionButtonConfig, ProfileFormButtonLabel } from '../types';

export type ProfileActionButtonsProps = {
  isLoading?: boolean;
  isDisabled?: boolean;
  onReset: () => void;
  onSubmit: () => Promise<void> | void;
};

const ProfileActionButtons = ({ isDisabled, isLoading, onReset, onSubmit }: ProfileActionButtonsProps) => {
  const PROFILE_ACTION_BUTTONS_CONFIG: ProfileActionButtonConfig[] = [
    {
      id: 1,
      icon: <VscDiscard size={20} />,
      label: ProfileFormButtonLabel.DiscardChanges,
      onClick: onReset,
      isDisabled,
      variant: 'ghost',
      type: 'button',
      className: 'text-primary hover:text-primary hover:bg-transparent',
    },
    {
      id: 2,
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
