import { RepairJobChecklistItem } from '@/shared/types';

export type CompleteButtonDisabledSate = {
  isCompleteButtonDisabled: boolean;
  tooltipMessage: string;
};

export type CompleteRepairJobFormValues = {
  checklist: RepairJobChecklistItem[];
};
