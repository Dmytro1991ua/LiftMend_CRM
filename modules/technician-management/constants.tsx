import BasicInformation from './components/technician-record-form/steps/basic-information';
import SkillsAndCertifications from './components/technician-record-form/steps/skills-and-certifications';
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
