import { TechnicianRecord } from '@/shared/types';

import {
  DEFAULT_DISABLED_TECHNICIAN_RECORD_TABLE_ROW_TOOLTIP_MESSAGE,
  DEFAULT_TECHNICIAN_RECORD_TABLE_ROW_TOOLTIP_MESSAGE,
} from './constants';

export const isTechnicianRecordRowDisabled = (rowOriginal: TechnicianRecord) =>
  rowOriginal.employmentStatus !== 'Active';

export const getRowTooltipMessage = (rowOriginal: TechnicianRecord) =>
  rowOriginal.employmentStatus !== 'Active'
    ? DEFAULT_DISABLED_TECHNICIAN_RECORD_TABLE_ROW_TOOLTIP_MESSAGE
    : DEFAULT_TECHNICIAN_RECORD_TABLE_ROW_TOOLTIP_MESSAGE;
