import { FaEye, FaEyeSlash } from 'react-icons/fa';

import {
  DEFAULT_ACTIVATION_MODAL_MESSAGE,
  DEFAULT_ACTIVATION_MODAL_TITLE,
  DEFAULT_DEACTIVATION_MODAL_MESSAGE,
  DEFAULT_DEACTIVATION_MODAL_TITLE,
} from './components/technician-management-table/constants';
import { EmploymentStatus, EmploymentStatusConfig } from './types';

export const EMPLOYMENT_STATUS_UPDATE_CONFIG: Record<EmploymentStatus, EmploymentStatusConfig> = {
  Active: {
    icon: <FaEye color='#2563eb' size={25} />,
    newEmploymentStatus: 'Inactive',
    newAvailabilityStatus: 'Unavailable',
    modalTitle: DEFAULT_DEACTIVATION_MODAL_TITLE,
    modalMessage: DEFAULT_DEACTIVATION_MODAL_MESSAGE,
  },
  Inactive: {
    icon: <FaEyeSlash color='#6b7280' size={25} />,
    newEmploymentStatus: 'Active',
    newAvailabilityStatus: 'Available',
    modalTitle: DEFAULT_ACTIVATION_MODAL_TITLE,
    modalMessage: DEFAULT_ACTIVATION_MODAL_MESSAGE,
  },
};
