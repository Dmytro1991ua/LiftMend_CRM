import { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@/components/ui/checkbox';
import Badge from '@/shared/badge';
import BaseScoreCell from '@/shared/base-score-cell/BaseScoreCell';
import BaseTableCheckbox from '@/shared/base-table/base-table-checkbox';
import Pill from '@/shared/pill';
import { PillStatus } from '@/shared/pill/config';
import { TechnicianRecord } from '@/shared/types';

import { TECHNICIAN_PERFORMANCE_SCORE_THRESHOLDS } from '../../config';
import { EmploymentStatus, TechnicianScoreLabel } from '../../types';
import DeleteActionCell from '../delete-action-cell';
import EditActionCell from '../edit-action-cell';
import EmploymentStatusToggleCell from '../employment-status-toggle-cell';

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
    header: 'Full Name',
    enableResizing: true,
    enableSorting: true,
    size: 150,
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
    accessorKey: 'performanceScore',
    header: 'Performance Score',
    cell: ({
      row: {
        original: { performanceMetrics },
      },
    }) => (
      <BaseScoreCell<TechnicianScoreLabel>
        score={performanceMetrics?.performanceScore}
        scoreThresholds={TECHNICIAN_PERFORMANCE_SCORE_THRESHOLDS}
        testId='performance-score-cell'
      />
    ),
    enableResizing: false,
    enableSorting: false,
    size: 160,
    minSize: 155,
    maxSize: 180,
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
    header: 'Skills',
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
    header: 'Certificates',
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
  {
    accessorKey: 'edit',
    header: 'Edit',
    cell: ({ row: { original } }) => <EditActionCell technicianRecord={original} />,
    enableSorting: false,
    size: 80,
    enableResizing: false,
    minSize: 80,
    maxSize: 100,
  },
  {
    accessorKey: 'delete',
    header: 'Delete',
    cell: ({ row: { original } }) => <DeleteActionCell technicianRecord={original} />,
    size: 80,
    enableResizing: false,
    minSize: 80,
    maxSize: 100,
    enableSorting: false,
  },
  {
    accessorKey: 'visibility',
    header: 'Technician Visibility',
    cell: ({
      row: {
        original: { employmentStatus, id, availabilityStatus, lastKnownAvailabilityStatus },
      },
    }) => (
      <EmploymentStatusToggleCell
        availabilityStatus={availabilityStatus}
        employmentStatus={employmentStatus as EmploymentStatus}
        lastKnownAvailabilityStatus={lastKnownAvailabilityStatus}
        technicianId={id}
      />
    ),
    enableResizing: true,
    enableSorting: true,
    size: 200,
    minSize: 120,
    maxSize: 350,
  },
];
