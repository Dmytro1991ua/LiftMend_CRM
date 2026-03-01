import { z } from 'zod';

export const createTechnicianStatusChangeSchema = (isDeactivating: boolean) =>
  z.object({
    deactivationReason: isDeactivating ? z.string().min(1, 'Deactivation Reason is required') : z.string().optional(),
  });
