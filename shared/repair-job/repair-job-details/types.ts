import { RepairJob } from '@/graphql/types/client/generated_types';
import { RepairJobFormValues } from '@/shared/repair-job/edit-repair-job-form/types';

export type OverlappingKeys = keyof RepairJob & keyof RepairJobFormValues;
