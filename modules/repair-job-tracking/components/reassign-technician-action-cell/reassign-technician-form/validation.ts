import { z } from 'zod';

export const INITIAL_REASSIGN_TECHNICIAN_VALUES = {
  selectedTechnician: null,
};

export const technicianReassignmentSchema = z.object({
  selectedTechnician: z
    .object({
      id: z.string().min(1, 'Technician is required'), // ensures a valid id
      value: z.string(),
      label: z.string(),
    })
    .nullable()
    .refine((val) => val !== null, 'Technician is required'), // ensure not null
});

export type TechnicianReassignmentFormFields = z.infer<typeof technicianReassignmentSchema>;
