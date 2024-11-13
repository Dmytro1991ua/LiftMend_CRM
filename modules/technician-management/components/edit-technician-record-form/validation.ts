import { z } from 'zod';

export const technicianRecordEditFormSchema = z.object({
  name: z.string().min(1, 'Technician full name is required'),
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
  skills: z.array(z.string()).min(1, 'Technician skills are required').max(5, 'Limit to 5 skills'),
  certifications: z.array(z.string()).optional(),
});
