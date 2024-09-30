import { useMemo } from 'react';

import BaseTable from '@/shared/base-table/BaseTable';
import { TableNames } from '@/shared/types';

import { Payment, columns } from './columns';

const ElevatorManagementTable = () => {
  // TODO: Test table data. Will be replaced later on with actual data
  const data = useMemo<Payment[]>(
    () => [
      { id: '728ed52f', amount: 100, status: 'pending', email: 'm@example.com' },
      { id: '489e1d42', amount: 125, status: 'processing', email: 'example@gmail.com' },
      { id: '4234e1d42', amount: 123, status: 'processing', email: 'example@gmail.com2' },
      // Add more rows...
    ],
    []
  );

  return (
    <BaseTable<Payment, unknown, unknown>
      columns={columns}
      data={data}
      filtersConfig={[]}
      hasMore={false}
      loadMore={() => null}
      loading={false}
      refetch={() => null!}
      tableName={TableNames.RepairJobsTable}
      tableStorageState={{}}
      onHandleRowClick={() => {}}
      onSetTableStorageState={() => {}}
    />
  );
};

export default ElevatorManagementTable;
