import { ApolloQueryResult } from '@apollo/client';

import BaseTable from '@/shared/base-table';
import { ElevatorDowntime, TableNames } from '@/shared/types';
import { NOOP } from '@/shared/utils';

import { ElEVATOR_DOWNTIME_HISTORY_COLUMNS } from './columns';

export type ElevatorDowntimeHistoryTableProps = {
  elevatorDowntimeList: ElevatorDowntime[];
};

const ElevatorDowntimeHistoryTable = ({ elevatorDowntimeList }: ElevatorDowntimeHistoryTableProps) => {
  return (
    <BaseTable
      className='h-[28rem]'
      columns={ElEVATOR_DOWNTIME_HISTORY_COLUMNS}
      data={elevatorDowntimeList}
      emptyTableMessage={'No elevator downtime history found.'}
      filtersConfig={[]}
      hasMore={false}
      hasTableFilters={false}
      isCalculatedWidthEnabled={false}
      isRowDisabled={() => false}
      loadMore={NOOP}
      loading={false}
      refetch={async () => {
        return {} as ApolloQueryResult<undefined>;
      }}
      tableName={TableNames.ElevatorDowntimeHistory}
      tableStorageState={{}}
      onHandleRowClick={NOOP}
      onSetTableStorageState={NOOP}
    />
  );
};

export default ElevatorDowntimeHistoryTable;
