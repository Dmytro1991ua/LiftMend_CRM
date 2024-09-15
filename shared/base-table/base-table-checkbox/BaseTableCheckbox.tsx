import { Table } from '@tanstack/react-table';

import { Checkbox } from '@/components/ui/checkbox';

type BaseTableCheckboxProps<T> = {
  table: Table<T>;
};

const BaseTableCheckbox = <T,>({ table }: BaseTableCheckboxProps<T>) => {
  return (
    <Checkbox
      aria-label='Select all'
      checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    />
  );
};

export default BaseTableCheckbox;
