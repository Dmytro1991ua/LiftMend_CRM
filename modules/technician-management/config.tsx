import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { ScoreThreshold } from '@/shared/base-score-cell/types';
import { getScoreTooltipMessage } from '@/shared/base-score-cell/utils';

import {
  DEFAULT_ACTIVATION_MODAL_MESSAGE,
  DEFAULT_ACTIVATION_MODAL_TITLE,
  DEFAULT_DEACTIVATION_MODAL_MESSAGE,
  DEFAULT_DEACTIVATION_MODAL_TITLE,
} from './components/technician-management-table/constants';
import BasicInformation from './components/technician-record-form/steps/basic-information';
import SkillsAndCertifications from './components/technician-record-form/steps/skills-and-certifications';
import { TechnicianRecordFormFields } from './components/technician-record-form/validation';
import { TECHNICIAN_PERFORMANCE_SCORE_TOOLTIP_TITLE } from './constants';
import {
  EmploymentStatus,
  EmploymentStatusConfig,
  TechnicianRecordSteps,
  TechnicianScoreLabel,
  TechnicianScoreTooltipDescription,
} from './types';

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

export const TECHNICIAN_PERFORMANCE_SCORE_THRESHOLDS: ScoreThreshold<TechnicianScoreLabel>[] = [
  {
    value: 90,
    label: TechnicianScoreLabel.Excellent,
    color: '#22c55e',
    classes: {
      background: 'bg-green-500',
      text: 'text-green-600',
      border: 'border-green-500',
    },
    activeDots: 4,
    tooltipProps: {
      id: TechnicianScoreLabel.Excellent,
      getTooltipMessage: (score: number) =>
        getScoreTooltipMessage({
          score,
          title: TECHNICIAN_PERFORMANCE_SCORE_TOOLTIP_TITLE,
          label: TechnicianScoreLabel.Excellent,
          description: TechnicianScoreTooltipDescription.Excellent,
        }),
    },
  },
  {
    value: 70,
    label: TechnicianScoreLabel.Good,
    color: '#facc15',
    classes: {
      background: 'bg-yellow-400',
      text: 'text-yellow-600',
      border: 'border-yellow-400',
    },
    activeDots: 3,
    tooltipProps: {
      id: TechnicianScoreLabel.Good,
      getTooltipMessage: (score: number) =>
        getScoreTooltipMessage({
          score,
          title: TECHNICIAN_PERFORMANCE_SCORE_TOOLTIP_TITLE,
          label: TechnicianScoreLabel.Good,
          description: TechnicianScoreTooltipDescription.Good,
        }),
    },
  },
  {
    value: 50,
    label: TechnicianScoreLabel.Fair,
    color: '#f97316',
    classes: {
      background: 'bg-orange-500',
      text: 'text-orange-600',
      border: 'border-orange-500',
    },
    activeDots: 2,
    tooltipProps: {
      id: TechnicianScoreLabel.Fair,
      getTooltipMessage: (score: number) =>
        getScoreTooltipMessage({
          score,
          title: TECHNICIAN_PERFORMANCE_SCORE_TOOLTIP_TITLE,
          label: TechnicianScoreLabel.Fair,
          description: TechnicianScoreTooltipDescription.Fair,
        }),
    },
  },
  {
    value: 0,
    label: TechnicianScoreLabel.Poor,
    color: '#ef4444',
    classes: {
      background: 'bg-red-500',
      text: 'text-red-600',
      border: 'border-red-500',
    },
    activeDots: 1,
    tooltipProps: {
      id: TechnicianScoreLabel.Poor,
      getTooltipMessage: (score: number) =>
        getScoreTooltipMessage({
          score,
          title: TECHNICIAN_PERFORMANCE_SCORE_TOOLTIP_TITLE,
          label: TechnicianScoreLabel.Poor,
          description: TechnicianScoreTooltipDescription.Poor,
        }),
    },
  },
];
