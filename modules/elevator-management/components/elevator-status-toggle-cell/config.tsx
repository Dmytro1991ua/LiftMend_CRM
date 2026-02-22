import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { ElevatorStatusConfig } from '../../types';

import {
  DEFAULT_ACTIVATION_MODAL_MESSAGE,
  DEFAULT_ACTIVATION_MODAL_TITLE,
  DEFAULT_DEACTIVATION_MODAL_MESSAGE,
  DEFAULT_DEACTIVATION_MODAL_TITLE,
} from './constants';

export const getElevatorStatusUpdateConfig = ({
  currentStatus,
  lastKnownStatus,
  iconColorClass,
}: {
  currentStatus: string;
  lastKnownStatus: string;
  iconColorClass?: string;
}): ElevatorStatusConfig => {
  if (currentStatus === 'Out of Service') {
    return {
      icon: <FaEyeSlash className={iconColorClass} />,
      newElevatorStatus: lastKnownStatus,
      modalTitle: DEFAULT_ACTIVATION_MODAL_TITLE,
      modalMessage: DEFAULT_ACTIVATION_MODAL_MESSAGE,
      dataTestId: 'elevator-status-icon-hidden',
      label: 'Activate',
    };
  }

  return {
    icon: <FaEye className={iconColorClass} />,
    newElevatorStatus: 'Out of Service',
    modalTitle: DEFAULT_DEACTIVATION_MODAL_TITLE,
    modalMessage: DEFAULT_DEACTIVATION_MODAL_MESSAGE,
    dataTestId: 'elevator-status-icon-visible',
    label: 'Deactivate',
  };
};
