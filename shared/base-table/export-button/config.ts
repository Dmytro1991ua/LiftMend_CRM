import { Cell } from '@tanstack/react-table';

import { ColumnsValueAccessors, TableModel, TableValue } from '@/shared/types';

import { formatDate } from '../utils';

import { boolToString } from './utils';

const accessors = {
  startDate: (cell: Cell<TableModel, TableValue>): string => formatDate(cell.row.original.startDate as Date),
  endDate: (cell: Cell<TableModel, TableValue>): string => formatDate(cell.row.original.endDate as Date),
  actualEndDate: (cell: Cell<TableModel, TableValue>): string => formatDate(cell.row.original.actualEndDate),
  skills: (cell: Cell<TableModel, TableValue>): string => cell.row.original.skills.join(', '),
  lastMaintenanceDate: (cell: Cell<TableModel, TableValue>): string =>
    formatDate(cell.row.original.lastMaintenanceDate),
  nextMaintenanceDate: (cell: Cell<TableModel, TableValue>): string =>
    formatDate(cell.row.original.nextMaintenanceDate),
  isOverdue: (cell: Cell<TableModel, TableValue>): string => boolToString(cell.row.original.isOverdue),
  inspectionStatus: (cell: Cell<TableModel, TableValue>): string => cell.row.original.inspectionStatus?.label ?? '',
  repairFrequencyStatus: (cell: Cell<TableModel, TableValue>): string =>
    cell.row.original.repairFrequencyStatus?.label ?? '',
};

const {
  startDate,
  endDate,
  actualEndDate,
  skills,
  lastMaintenanceDate,
  nextMaintenanceDate,
  isOverdue,
  repairFrequencyStatus,
  inspectionStatus,
} = accessors;

export const columnsValueAccessors: ColumnsValueAccessors = {
  actualEndDate,
  startDate,
  endDate,
  skills,
  lastMaintenanceDate,
  nextMaintenanceDate,
  isOverdue,
  repairFrequencyStatus,
  inspectionStatus,
};
