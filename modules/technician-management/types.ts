export enum TechnicianRecordSteps {
  BasicInformation,
  SkillsAndCertifications,
}

export enum TechnicianScoreLabel {
  Excellent = 'Excellent',
  Good = 'Good',
  Fair = 'Fair',
  Poor = 'Poor',
}

export enum TechnicianScoreTooltipDescription {
  Excellent = 'Outstanding performance, on time consistently.',
  Good = 'Reliable performance with minor delays.',
  Fair = 'Some delays or inconsistent performance.',
  Poor = 'Frequent delays, needs immediate attention.',
}

export type TechnicianRecordFormValues = {
  id: string;
  name: string;
  contactInformation?: string | null;
  skills: string[];
  certifications: string[];
  availabilityStatus: string | null;
  employmentStatus: string | null;
};

export type EditTechnicalRecordFormValues = Omit<TechnicianRecordFormValues, 'employmentStatus' | 'availabilityStatus'>;
export type EmploymentStatus = 'Active' | 'Inactive';
export type EmploymentStatusConfig = {
  icon: JSX.Element;
  newEmploymentStatus: EmploymentStatus;
  newAvailabilityStatus: string;
  modalTitle: string;
  modalMessage: string;
};
