import BasicInformation from './components/technician-record-form/steps/basic-information';
import SkillsAndCertifications from './components/technician-record-form/steps/skills-and-certifications';
import { TechnicianRecordFormFields } from './components/technician-record-form/validation';
import { TechnicianRecordSteps } from './types';

export const ADD_TECHNICIAN_RECORD_BUTTON_LABEL = 'Add Technician Record';
export const CREATE_NEW_TECHNICIAN_MODAL_TITLE = 'Create Technician Record';

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

export const AVAILABILITY_STATUS_TOOLTIP_MESSAGE =
  'Available status indicates the technician is ready for assignment and is not editable.';
export const EMPLOYMENT_STATUS_TOOLTIP_MESSAGE =
  'Active reflects that the technician is currently employed. This status is predefined and cannot be modified within this form.';
