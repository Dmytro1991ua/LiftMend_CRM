export enum TechnicianRecordSteps {
  BasicInformation,
  SkillsAndCertifications,
}

export type TechnicianRecordFormValues = {
  id: string;
  name: string;
  contactInformation?: string | null;
  skills: string[];
  certifications: string;
  availabilityStatus: string | null;
  employmentStatus: string | null;
};
