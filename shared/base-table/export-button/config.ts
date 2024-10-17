import { Cell } from '@tanstack/react-table';

import { ColumnsValueAccessors, TableModel, TableValue } from '@/shared/types';

import { formatDate } from '../utils';

const accessors = {
  startDate: (cell: Cell<TableModel, TableValue>): string => formatDate(cell.row.original.startDate),
  endDate: (cell: Cell<TableModel, TableValue>): string => formatDate(cell.row.original.endDate),
  technicianSkills: (cell: Cell<TableModel, TableValue>): string => cell.row.original.technicianSkills.join(', '),
  lastMaintenanceDate: (cell: Cell<TableModel, TableValue>): string =>
    formatDate(cell.row.original.lastMaintenanceDate),
  nextMaintenanceDate: (cell: Cell<TableModel, TableValue>): string =>
    formatDate(cell.row.original.nextMaintenanceDate),
};

const { startDate, endDate, technicianSkills, lastMaintenanceDate, nextMaintenanceDate } = accessors;

export const columnsValueAccessors: ColumnsValueAccessors = {
  startDate,
  endDate,
  technicianSkills,
  lastMaintenanceDate,
  nextMaintenanceDate,
};
