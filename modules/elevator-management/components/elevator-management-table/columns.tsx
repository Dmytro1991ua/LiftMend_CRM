import { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@/components/ui/checkbox';
import BaseScoreCell from '@/shared/base-score-cell/BaseScoreCell';
import BaseTableCheckbox from '@/shared/base-table/base-table-checkbox';
import DatePicker from '@/shared/date-picker';
import { PillStatus } from '@/shared/pill/config';
import { ElevatorRecord } from '@/shared/types';

import Pill from '../../../../shared/pill/Pill';
import { ELEVATOR_HEALTH_SCORE_THRESHOLDS } from '../../config';
import { ElevatorStatus, HealthScoreLabel } from '../../types';
import CompleteElevatorInspectionCell from '../complete-elevator-inspection-cell';
import DeleteActionCell from '../delete-action-cell';
import EditActionCell from '../edit-action-cell';
import ElevatorStatusToggleCell from '../elevator-status-toggle-cell';
import InspectionStatus from '../inspection-status';

export const ELEVATOR_MANAGEMENT_COLUMNS: ColumnDef<ElevatorRecord>[] = [
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
    accessorKey: 'elevatorType',
    header: 'Elevator Type',
    enableResizing: true,
    enableSorting: true,
    size: 220,
    minSize: 180,
    maxSize: 350,
  },
  {
    accessorKey: 'buildingName',
    header: 'Building Name',
    enableResizing: true,
    enableSorting: true,
    size: 270,
    minSize: 220,
    maxSize: 300,
  },
  {
    accessorKey: 'elevatorLocation',
    header: 'Elevator Location',
    enableResizing: true,
    enableSorting: true,
    size: 220,
    minSize: 180,
    maxSize: 350,
  },
  {
    accessorKey: 'id',
    header: 'Record Id',
    enableResizing: false,
    enableSorting: false,
    size: 340,
    maxSize: 360,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({
      row: {
        original: { status },
      },
    }) => <Pill status={status as PillStatus} />,
    enableResizing: true,
    enableSorting: true,
    size: 180,
    minSize: 120,
    maxSize: 350,
  },
  {
    accessorKey: 'healthScore',
    header: 'Health Score',
    cell: ({
      row: {
        original: { healthScore },
      },
    }) => (
      <BaseScoreCell<HealthScoreLabel>
        score={healthScore}
        scoreThresholds={ELEVATOR_HEALTH_SCORE_THRESHOLDS}
        testId='health-score-cell'
      />
    ),
    enableResizing: false,
    enableSorting: false,
    size: 120,
    minSize: 100,
    maxSize: 150,
  },
  {
    accessorKey: 'capacity',
    header: 'Capacity (kg)',
    enableResizing: false,
    enableSorting: false,
    size: 150,
    minSize: 120,
    maxSize: 180,
  },
  {
    accessorKey: 'lastMaintenanceDate',
    header: 'Last Maintenance Date',
    enableResizing: true,
    cell: ({
      row: {
        original: { lastMaintenanceDate },
      },
    }) => (
      <DatePicker
        key={`${lastMaintenanceDate}`}
        isDisabled
        isDateRangeMode={false}
        numberOfMonths={1}
        singleDate={lastMaintenanceDate}
      />
    ),
    enableSorting: true,
    size: 300,
    minSize: 300,
    maxSize: 500,
  },
  {
    accessorKey: 'nextMaintenanceDate',
    header: 'Next Maintenance Date',
    enableResizing: true,
    enableSorting: true,
    cell: ({
      row: {
        original: { nextMaintenanceDate },
      },
    }) => (
      <DatePicker
        key={`${nextMaintenanceDate}`}
        isDisabled
        isDateRangeMode={false}
        numberOfMonths={1}
        singleDate={nextMaintenanceDate}
      />
    ),
    size: 300,
    minSize: 300,
    maxSize: 500,
  },
  {
    accessorKey: 'lastInspectionDate',
    header: 'Last Inspection Date',
    enableResizing: true,
    enableSorting: true,
    cell: ({
      row: {
        original: { lastInspectionDate },
      },
    }) => (
      <DatePicker
        key={`${lastInspectionDate}`}
        isDisabled
        isDateRangeMode={false}
        numberOfMonths={1}
        singleDate={lastInspectionDate ?? undefined}
      />
    ),
    size: 300,
    minSize: 300,
    maxSize: 500,
  },
  {
    accessorKey: 'nextInspectionDate',
    header: 'Next Inspection Date',
    enableResizing: true,
    enableSorting: true,
    cell: ({
      row: {
        original: { nextInspectionDate },
      },
    }) => (
      <DatePicker
        key={`${nextInspectionDate}`}
        isDisabled
        isDateRangeMode={false}
        numberOfMonths={1}
        singleDate={nextInspectionDate ?? undefined}
      />
    ),
    size: 300,
    minSize: 300,
    maxSize: 500,
  },
  {
    accessorKey: 'inspectionStatus',
    header: 'Inspection Status',
    enableResizing: true,
    enableSorting: false,
    cell: ({
      row: {
        original: { inspectionStatus },
      },
    }) => <InspectionStatus inspectionStatus={inspectionStatus} />,
    size: 300,
    minSize: 220,
    maxSize: 250,
  },
  {
    accessorKey: 'completeInspection',
    header: ' Complete Inspection',
    cell: ({
      row: {
        original: { id },
      },
    }) => <CompleteElevatorInspectionCell elevatorId={id} />,
    enableSorting: false,
    size: 80,
    enableResizing: false,
    minSize: 180,
    maxSize: 200,
  },
  {
    accessorKey: 'edit',
    header: 'Edit',
    cell: ({ row: { original } }) => <EditActionCell elevatorRecord={original} />,
    enableSorting: false,
    size: 80,
    enableResizing: false,
    minSize: 80,
    maxSize: 100,
  },
  {
    accessorKey: 'delete',
    header: 'Delete',
    cell: ({ row: { original } }) => <DeleteActionCell elevatorRecord={original} />,
    size: 80,
    enableResizing: false,
    minSize: 80,
    maxSize: 100,
    enableSorting: false,
  },
  {
    accessorKey: 'visibility',
    header: 'Elevator Visibility',
    cell: ({
      row: {
        original: { status, id, lastKnownStatus },
      },
    }) => (
      <ElevatorStatusToggleCell
        elevatorRecordId={id}
        lastKnownStatus={lastKnownStatus}
        status={status as ElevatorStatus}
      />
    ),
    enableResizing: true,
    enableSorting: true,
    size: 200,
    minSize: 120,
    maxSize: 350,
  },
];
