import { Cell, Column, RowModel } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Maybe } from 'graphql/jsutils/Maybe';
import { upperFirst } from 'lodash';

import { TableNames } from '@/shared/types';

import { columnsValueAccessors } from './config';

const headerColumnsToIgnore = ['edit', 'delete', 'reassignTechnician', 'visibility'];
const rowCellsToIgnore = [...headerColumnsToIgnore, 'select'];

export const convertCurrentDateToExportFileNameDate = (date: Date): string => {
  // eslint-disable-next-line quotes
  return format(date, "MMddyy'_'HHmma");
};

export const convertExportFileNameToCorrectFormat = (tableName: TableNames, date: Date): string => {
  return `${upperFirst(tableName).replace(/ /g, '')}_${convertCurrentDateToExportFileNameDate(date)}`;
};

export const getHeaderColumns = <T>(columns: Column<T, unknown>[]): string[] => {
  const headerColumns = columns.reduce<string[]>(
    (acc, column) => {
      if (
        !column.getIsVisible() ||
        typeof column.columnDef.header !== 'string' ||
        headerColumnsToIgnore.includes(column.id)
      ) {
        return acc;
      }

      return [...acc, column.columnDef.header];
    },
    ['Select']
  );

  return headerColumns;
};

export const formatToCSVValue = (value?: string | string[] | null | Date | boolean | unknown): string => {
  if (value) {
    // According to CSV spec:REF-4180 If double quotes are used
    // then another double quotes must be before it
    return value.toString().replace(/"/g, (match: string) => `"${match}`);
  }

  return '';
};

const getAccessorValue = <T>(cell: Cell<T, unknown>, tableName: TableNames): string => {
  const customAccessorsMap: Record<TableNames, Record<string, (cell: Cell<T, unknown>) => string>> = {
    [TableNames.RepairJobsTable]: {},
    [TableNames.ElevatorManagementTable]: {},
    [TableNames.TechnicianManagementTable]: {},
    [TableNames.RecentRepairJobs]: {},
    [TableNames.ElevatorMentainanceHistory]: {},
  };

  const accessor = customAccessorsMap[tableName]?.[cell.column.id] || columnsValueAccessors[cell.column.id];

  return accessor ? accessor(cell) : formatToCSVValue(cell.getValue());
};

const getRowsValues = <T>(rowModel: RowModel<T>, tableName: TableNames): string[][] => {
  return rowModel.rows.map((row) => {
    const rowValues: string[] = row.getVisibleCells().reduce<string[]>((acc, cell) => {
      if (!rowCellsToIgnore.includes(cell.column.id)) {
        acc.push(getAccessorValue(cell as Cell<T, unknown>, tableName));
      }
      return acc;
    }, []);

    return [row.getIsSelected() ? '+' : '-', ...rowValues];
  });
};

export const getDataToExport = <T>(
  tableName: TableNames,
  columns?: Column<T, unknown>[],
  rowModel?: RowModel<T>
): string[][] => {
  if (!rowModel || !columns?.length) return [];

  const headerColumns = getHeaderColumns(columns);
  const rowsValues = getRowsValues(rowModel, tableName);

  return [headerColumns, ...rowsValues];
};

export const boolToString = (value: Maybe<boolean>): string => (value ? 'Yes' : 'No');
