import { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@/components/ui/checkbox';
import Badge from '@/shared/badge';
import BaseTableCheckbox from '@/shared/base-table/base-table-checkbox';
import Pill from '@/shared/pill';
import { PillStatus } from '@/shared/pill/config';
import { TechnicianRecord } from '@/shared/types';

export const TECHNICIAN_RECORD_COLUMNS: ColumnDef<TechnicianRecord>[] = [
  {
    id: 'select',
    header: ({ table }) => <BaseTableCheckbox table={table} />,
    cell: ({ row }) => (
      <Checkbox
        aria-label='Select row'
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableResizing: false,
    size: 60,
  },
  {
    accessorKey: 'name',
    header: 'Technician Name',
    enableResizing: true,
    enableSorting: true,
    size: 180,
    minSize: 120,
    maxSize: 350,
  },
  {
    accessorKey: 'id',
    header: 'Technician Id',
    enableResizing: true,
    enableSorting: false,
    size: 320,
    maxSize: 320,
  },
  {
    accessorKey: 'availabilityStatus',
    header: 'Availability Status',
    cell: ({
      row: {
        original: { availabilityStatus },
      },
    }) => <Pill status={availabilityStatus as PillStatus} />,
    enableResizing: true,
    enableSorting: true,
    size: 200,
    minSize: 120,
    maxSize: 350,
  },
  {
    accessorKey: 'contactInformation',
    header: 'Contact Information',
    enableResizing: true,
    enableSorting: false,
    size: 220,
    minSize: 150,
    maxSize: 300,
  },
  {
    accessorKey: 'skills',
    header: 'Technician Skills',
    cell: ({
      row: {
        original: { skills },
      },
    }) => <Badge bgColor='bg-primary' className='flex flex-col text-center' items={skills ?? []} />,
    size: 250,
    enableResizing: true,
    enableSorting: false,
    minSize: 120,
    maxSize: 400,
  },
  {
    accessorKey: 'certifications',
    header: 'Technician Certificates',
    cell: ({
      row: {
        original: { certifications },
      },
    }) => <Badge bgColor='bg-cyan-600' className='flex flex-col text-center' items={certifications ?? []} />,
    size: 280,
    enableResizing: true,
    enableSorting: false,
    minSize: 120,
    maxSize: 400,
  },
  {
    accessorKey: 'employmentStatus',
    header: 'Employment Status',
    cell: ({
      row: {
        original: { employmentStatus },
      },
    }) => <Pill status={employmentStatus as PillStatus} />,
    enableResizing: true,
    enableSorting: true,
    size: 200,
    minSize: 120,
    maxSize: 350,
  },
];
