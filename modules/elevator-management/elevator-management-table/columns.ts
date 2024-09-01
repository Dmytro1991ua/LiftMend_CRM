import { ColumnDef } from '@tanstack/react-table';

// TODO Test version of columns. Will be replaced later on with correct columns

export type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'id', // Unique key in the data
    header: 'ID',
    size: 20,
    minSize: 20,
    enableResizing: true,
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    size: 20,
    enableResizing: true,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 20,
    enableResizing: true,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    size: 20,
    enableResizing: true,
  },
  // Add more columns as needed...
];
