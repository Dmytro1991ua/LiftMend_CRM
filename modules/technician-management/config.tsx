import { FaEye, FaEyeSlash } from 'react-icons/fa';

import {
  DEFAULT_ACTIVATION_MODAL_MESSAGE,
  DEFAULT_ACTIVATION_MODAL_TITLE,
  DEFAULT_DEACTIVATION_MODAL_MESSAGE,
  DEFAULT_DEACTIVATION_MODAL_TITLE,
} from './components/technician-management-table/constants';
import BasicInformation from './components/technician-record-form/steps/basic-information';
import SkillsAndCertifications from './components/technician-record-form/steps/skills-and-certifications';
import { TechnicianRecordFormFields } from './components/technician-record-form/validation';
import { EmploymentStatus, EmploymentStatusConfig, TechnicianRecordSteps } from './types';

export const getEmploymentStatusUpdateConfig = (
  lastKnownAvailabilityStatus: string
): Record<EmploymentStatus, EmploymentStatusConfig> => {
  return {
    Active: {
      icon: <FaEye color='#2563eb' data-testid='active-technician-icon' size={25} />,
      newEmploymentStatus: 'Inactive',
      newAvailabilityStatus: 'Unavailable',
      modalTitle: DEFAULT_DEACTIVATION_MODAL_TITLE,
      modalMessage: DEFAULT_DEACTIVATION_MODAL_MESSAGE,
    },
    Inactive: {
      icon: <FaEyeSlash color='#6b7280' data-testid='inactive-technician-icon' size={25} />,
      newEmploymentStatus: 'Active',
      newAvailabilityStatus: lastKnownAvailabilityStatus,
      modalTitle: DEFAULT_ACTIVATION_MODAL_TITLE,
      modalMessage: DEFAULT_ACTIVATION_MODAL_MESSAGE,
    },
  };
};

export const TECHNICIAN_RECORD_FORM_STEPS = [
  { id: TechnicianRecordSteps.BasicInformation, value: 'Basic Information' },
  { id: TechnicianRecordSteps.SkillsAndCertifications, value: 'Skills and Certifications' },
];

export const TECHNICIAN_RECORD_STEP_CONTENT_CONFIG: Record<TechnicianRecordSteps, React.ReactNode> = {
  [TechnicianRecordSteps.BasicInformation]: <BasicInformation />,
  [TechnicianRecordSteps.SkillsAndCertifications]: <SkillsAndCertifications />,
};

export const TECHNICIAN_RECORD_STEP_VALIDATION_CONFIG: Record<number, keyof TechnicianRecordFormFields> = {
  0: 'basicInformation',
  1: 'skillsAndCertifications',
};
