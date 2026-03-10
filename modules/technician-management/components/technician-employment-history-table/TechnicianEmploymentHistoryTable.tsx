import { ApolloQueryResult } from '@apollo/client';

import BaseTable from '@/shared/base-table';
import { TableNames, TechnicianEmploymentHistory } from '@/shared/types';
import { NOOP } from '@/shared/utils';

import { TECHNICIAN_EMPLOYMENT_HISTORY_COLUMNS } from './coulumns';

export type TechnicianEmploymentHistoryTableProps = {
  employmentHistory: TechnicianEmploymentHistory[];
};

const TechnicianEmploymentHistoryTable = ({ employmentHistory }: TechnicianEmploymentHistoryTableProps) => {
  return (
    <BaseTable
      className='h-[28rem]'
      columns={TECHNICIAN_EMPLOYMENT_HISTORY_COLUMNS}
      data={employmentHistory}
      emptyTableMessage={'No technician employment history found.'}
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
      tableName={TableNames.TechnicianEmploymentHistory}
      tableStorageState={{}}
      onHandleRowClick={NOOP}
      onSetTableStorageState={NOOP}
    />
  );
};

export default TechnicianEmploymentHistoryTable;
