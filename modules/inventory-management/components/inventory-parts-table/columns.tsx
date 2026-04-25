import { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@/components/ui/checkbox';
import BaseTableCheckbox from '@/shared/base-table/base-table-checkbox';
import Pill from '@/shared/pill';
import { PillStatus } from '@/shared/pill/config';
import { InventoryPart } from '@/shared/types';
import { formatCurrency } from '@/shared/utils';

export const INVENTORY_PART_MANAGEMENT_COLUMNS: ColumnDef<InventoryPart>[] = [
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
    accessorKey: 'id',
    header: 'Record Id',
    enableResizing: false,
    enableSorting: false,
    size: 340,
    maxSize: 360,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    enableResizing: true,
    enableSorting: false,
    size: 220,
    minSize: 180,
    maxSize: 350,
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
    enableResizing: true,
    enableSorting: false,
    size: 150,
    minSize: 150,
    maxSize: 180,
  },
  {
    accessorKey: 'minStock',
    header: 'Min Stock',
    enableResizing: true,
    enableSorting: false,
    size: 150,
    minSize: 150,
    maxSize: 180,
  },

  {
    accessorKey: 'unitPrice',
    header: 'Unit Price',
    cell: ({
      row: {
        original: { unitPrice },
      },
    }) => formatCurrency(unitPrice),
    enableResizing: true,
    enableSorting: true,
    size: 150,
    minSize: 150,
    maxSize: 180,
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
];
