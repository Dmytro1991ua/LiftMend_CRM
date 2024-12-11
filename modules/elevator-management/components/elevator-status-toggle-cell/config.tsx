import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { ElevatorStatus, ElevatorStatusConfig } from '../../types';

import {
  DEFAULT_ACTIVATION_MODAL_MESSAGE,
  DEFAULT_ACTIVATION_MODAL_TITLE,
  DEFAULT_DEACTIVATION_MODAL_MESSAGE,
  DEFAULT_DEACTIVATION_MODAL_TITLE,
} from './constants';

export const getElevatorStatusUpdateConfig = (currentStatus: string, lastKnownStatus: string): ElevatorStatusConfig => {
  if (currentStatus === 'Out of Service') {
    return {
      icon: <FaEyeSlash color='#6b7280' size={25} />,
      newElevatorStatus: lastKnownStatus,
      modalTitle: DEFAULT_ACTIVATION_MODAL_TITLE,
      modalMessage: DEFAULT_ACTIVATION_MODAL_MESSAGE,
    };
  }

  return {
    icon: <FaEye color='#2563eb' size={25} />,
    newElevatorStatus: 'Out of Service',
    modalTitle: DEFAULT_DEACTIVATION_MODAL_TITLE,
    modalMessage: DEFAULT_DEACTIVATION_MODAL_MESSAGE,
  };
};
