export enum TechnicianRecordSteps {
  BasicInformation,
  SkillsAndCertifications,
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
