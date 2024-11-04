import { z } from 'zod';

export const INITIAL_TECHNICIAN_RECORD_FORM_VALUES = {
  basicInformation: {
    fullName: '',
    contactInformation: '',
    availabilityStatus: 'Available' as const,
    employmentStatus: 'Active' as const,
  },
  skillsAndCertifications: {
    skills: [],
    certificates: [],
  },
};

export const basicInformationSchema = z.object({
  fullName: z.string().min(1, 'Technician full name is required'),
  contactInformation: z
    .string({
      required_error: 'Contact information is required',
    })
    .refine((value) => {
      const phoneRegex = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return phoneRegex.test(value) || emailRegex.test(value);
    }, 'Contact information must be a valid phone number or email address'),
  availabilityStatus: z.preprocess(() => 'Available', z.literal('Available')),
  employmentStatus: z.preprocess(() => 'Active', z.literal('Active')),
});

export const skillsAndCertificationsSchema = z.object({
  skills: z.array(z.string()).min(1, 'Technician skills are required').max(5, 'Limit to 5 skills'),
  certificates: z.array(z.string()).optional(),
});

export const technicianRecordFormSchema = z.object({
  basicInformation: basicInformationSchema,
  skillsAndCertifications: skillsAndCertificationsSchema,
});

export type TechnicianRecordFormFields = z.infer<typeof technicianRecordFormSchema>;
