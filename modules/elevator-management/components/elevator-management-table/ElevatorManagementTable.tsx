import BaseTable from '@/shared/base-table/BaseTable';
import { ElevatorRecord, TableNames } from '@/shared/types';

import { ELEVATOR_MANAGEMENT_COLUMNS } from './columns';

const ElevatorManagementTable = () => {
  return (
    <BaseTable<ElevatorRecord, unknown, unknown>
      className='h-[48rem]'
      columns={ELEVATOR_MANAGEMENT_COLUMNS}
      data={[]}
      filtersConfig={[]}
      hasMore={false}
      loadMore={() => null}
      loading={false}
      refetch={() => null!}
      tableName={TableNames.ElevatorManagementTable}
      tableStorageState={{}}
      onHandleRowClick={() => {}}
      onSetTableStorageState={() => {}}
    />
  );
};

export default ElevatorManagementTable;
