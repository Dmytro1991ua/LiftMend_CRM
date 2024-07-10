import BaseTable from '@/shared/base-table/BaseTable';

import { Payment, columns } from './columns';

const ElevatorManagementTable = () => {
  // TODO: Test table data. Will be replaced later on with actual data
  const payments: Payment[] = [
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'm@example.com',
    },
    {
      id: '489e1d42',
      amount: 125,
      status: 'processing',
      email: 'example@gmail.com',
    },
    {
      id: '4234e1d42',
      amount: 123,
      status: 'processing',
      email: 'example@gmail.com2',
    },
    // ...
  ];

  return <BaseTable columns={columns} data={payments} hasMore={false} loadMore={() => null} loading={false} />;
};

export default ElevatorManagementTable;
