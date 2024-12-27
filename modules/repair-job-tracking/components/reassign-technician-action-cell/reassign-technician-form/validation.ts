import { z } from 'zod';

export const INITIAL_REASSIGN_TECHNICIAN_VALUES = {
  technicianName: '',
};

export const technicianReassignmentSchema = z.object({
  technicianName: z.string().min(1, 'Technician name is required'),
});

export type TechnicianReassignmentFormFields = z.infer<typeof technicianReassignmentSchema>;
