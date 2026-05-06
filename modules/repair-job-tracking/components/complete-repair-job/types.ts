import { RepairJobChecklistItem, RepairJobFormInventoryPartUsed } from '@/shared/types';

export type CompleteButtonDisabledSate = {
  isCompleteButtonDisabled: boolean;
  tooltipMessage: string;
};

export type CompleteRepairJobFormValues = {
  checklist: RepairJobChecklistItem[];
  evidencePhoto: File | null;
  partsUsed: RepairJobFormInventoryPartUsed[];
};
