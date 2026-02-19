import { z } from 'zod';

export const createElevatorStatusToggleSchema = (isDeactivating: boolean) =>
  z.object({
    deactivationReason: isDeactivating ? z.string().min(1, 'Deactivation Reason is required') : z.string().optional(),
  });
