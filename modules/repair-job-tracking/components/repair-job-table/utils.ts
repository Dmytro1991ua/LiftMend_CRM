import { RowHightLightInfo } from '@/shared/base-table/types';
import { RepairJob } from '@/shared/types';

export const getRepairJobRowHighlightInfo = (rowData: RepairJob): RowHightLightInfo => {
  const isRowHighlighted = rowData.status === 'Completed';

  return {
    isHighlighted: isRowHighlighted,
    highlightStyles: 'bg-green-50 hover:bg-green-50',
  };
};
