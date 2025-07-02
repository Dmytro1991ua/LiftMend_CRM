import { Column, Row } from '@tanstack/react-table';

import { TestData, createMockColumn, createMockRow, createMockRowModel } from '@/mocks/tableMoks';
import {
  convertCurrentDateToExportFileNameDate,
  convertExportFileNameToCorrectFormat,
  formatToCSVValue,
  getDataToExport,
  getHeaderColumns,
} from '@/shared/base-table/export-button/utils';
import { TableNames } from '@/shared/types';

describe('utils', () => {
  const mockDate = new Date('2025-06-25T10:00:00');
  const mockTimeValue = mockDate.getTime();

  beforeAll(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => mockTimeValue);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('convertCurrentDateToExportFileNameDate', () => {
    it('should correctly convert current date to export file name date', () => {
      expect(convertCurrentDateToExportFileNameDate(mockDate)).toEqual('062525_1000AM');
    });
  });

  describe('convertExportFileNameToCorrectFormat', () => {
    it('should correctly convert export file name to correct format for Elevator Records table', () => {
      expect(convertExportFileNameToCorrectFormat(TableNames.ElevatorManagementTable, mockDate)).toEqual(
        'ElevatorManagement_062525_1000AM'
      );
    });

    it('should correctly convert export file name to correct format for Repair Jobs table', () => {
      expect(convertExportFileNameToCorrectFormat(TableNames.RepairJobsTable, mockDate)).toEqual(
        'RepairJobs_062525_1000AM'
      );
    });

    it('should correctly convert export file name to correct format for Technician records table', () => {
      expect(convertExportFileNameToCorrectFormat(TableNames.TechnicianManagementTable, mockDate)).toEqual(
        'TechnicianManagement_062525_1000AM'
      );
    });
  });

  describe('getHeaderColumns', () => {
    it('should return visible columns with string headers', () => {
      const mockColumns = [
        {
          ...createMockColumn('name', 'name', 'Name'),
          columnDef: { header: 'Name', accessorKey: 'name' },
        },
        {
          ...createMockColumn('email', 'email', 'Email'),
          columnDef: { header: 'Email', accessorKey: 'email' },
        },
        {
          ...createMockColumn('age', 'age', 'Age'),
          columnDef: { header: 'Age', accessorKey: 'age' }, // 👈 string header
        },
      ] as Column<TestData, unknown>[];

      expect(getHeaderColumns(mockColumns)).toEqual(['Select', 'Name', 'Email', 'Age']);
    });

    it('should skip hidden columns', () => {
      const mockColumns = [
        {
          ...createMockColumn('name', 'name', 'Name', false),
          columnDef: { accessorKey: 'name', header: 'Name' },
        },
        {
          ...createMockColumn('email', 'email', 'Email', true),
          columnDef: { accessorKey: 'email', header: 'Email' },
        },
      ] as Column<TestData, unknown>[];

      expect(getHeaderColumns(mockColumns)).toEqual(['Select', 'Email']);
    });

    it('should skip columns with non-string headers', () => {
      const mockColumns = [
        createMockColumn('name', 'name', 'Name'),
        {
          ...createMockColumn('email', 'email', 'Email'),
          columnDef: { accessorKey: 'email', header: 'Email' },
        },
      ] as Column<TestData, unknown>[];

      expect(getHeaderColumns(mockColumns)).toEqual(['Select', 'Email']);
    });

    it('should skip columns included in headerColumnsToIgnore', () => {
      const mockColumns = [
        {
          ...createMockColumn('delete', 'delete', 'Delete'),
          columnDef: { accessorKey: 'delete', header: 'Delete' },
        },
        {
          ...createMockColumn('edit', 'edit', 'Edit'),
          columnDef: { accessorKey: 'edit', header: 'Edit' },
        },
        {
          ...createMockColumn('name', 'name', 'Name'),
          columnDef: { accessorKey: 'name', header: 'Name' },
        },
      ] as Column<TestData, unknown>[];

      expect(getHeaderColumns(mockColumns)).toEqual(['Select', 'Name']);
    });

    it('should return only Select when all columns are filtered out', () => {
      const mockColumns = [createMockColumn('edit', 'edit', 'Edit', false)] as Column<TestData, unknown>[];

      expect(getHeaderColumns(mockColumns)).toEqual(['Select']);
    });
  });

  describe('formatToCSVValue', () => {
    it('should return empty string if value undefined', () => {
      expect(formatToCSVValue(undefined)).toEqual('');
    });

    it('should return empty string if value null', () => {
      expect(formatToCSVValue(null)).toEqual('');
    });

    it('should return date string', () => {
      expect(formatToCSVValue(mockDate)).toBe(mockDate.toString());
    });

    it('should return flattened array of strings', () => {
      expect(formatToCSVValue(['one', 'two', 'three'])).toBe('one,two,three');
    });

    it('should escape double quotes in strings', () => {
      expect(formatToCSVValue('"quoted"')).toBe('""quoted""');
      expect(formatToCSVValue('a "b" c')).toBe('a ""b"" c');
    });
  });

  describe('getDataToExport', () => {
    const mockRowData: TestData = {
      name: 'Joe',
      email: 'test@gmail.com',
      age: 30,
    };
    const mockColumns = [
      {
        ...createMockColumn('name', 'name', 'Name'),
        columnDef: { accessorKey: 'name', header: 'Name' },
      },
      {
        ...createMockColumn('email', 'email', 'Email'),
        columnDef: { accessorKey: 'email', header: 'Email' },
      },
      {
        ...createMockColumn('age', 'age', 'Age'),
        columnDef: { accessorKey: 'age', header: 'Age' },
      },
    ] as Column<TestData, unknown>[];
    const mockRow = createMockRow('name', mockRowData);
    const mockRowModel = createMockRowModel([mockRow as Row<TestData>]);

    it('should return empty array if columns are undefined', () => {
      expect(getDataToExport(TableNames.ElevatorManagementTable, undefined, mockRowModel)).toEqual([]);
    });

    it('should return empty array if rowModel is undefined', () => {
      expect(getDataToExport(TableNames.ElevatorManagementTable, mockColumns, undefined)).toEqual([]);
    });

    it('should return header with rows if both rowModel and columns exist', () => {
      expect(getDataToExport(TableNames.ElevatorManagementTable, mockColumns, mockRowModel)).toEqual([
        ['Select', 'Name', 'Email', 'Age'],
        ['-', 'Joe', 'test@gmail.com', '30'],
      ]);
    });
  });
});
