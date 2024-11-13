import { TechnicianRecord } from '@/shared/types';

import { EditTechnicalRecordFormValues, TechnicianRecordFormValues } from './types';

export const convertTechnicianRecordToFormValues = (
  technicianRecord: TechnicianRecord
): EditTechnicalRecordFormValues => ({
  contactInformation: technicianRecord ? technicianRecord.contactInformation : '',
  id: technicianRecord ? technicianRecord.id : '',
  name: technicianRecord ? technicianRecord.name : '',
  skills: technicianRecord ? technicianRecord.skills : [],
  certifications: technicianRecord ? technicianRecord.certifications : [],
});

export const convertFormFieldsToTechnicianRecord = (
  formFields: TechnicianRecordFormValues
): EditTechnicalRecordFormValues => ({
  contactInformation: formFields.contactInformation ?? '',
  id: formFields.id ?? '',
  certifications: formFields.certifications ?? [],
  name: formFields.name ?? '',
  skills: formFields.skills ?? [],
});
