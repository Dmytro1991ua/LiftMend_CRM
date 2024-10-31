import { GetTechnicianRecordsQuery, QueryGetTechnicianRecordsArgs } from '@/graphql/types/client/generated_types';
import { DEFAULT_SEARCH_INPUT_PLACEHOLDER } from '@/modules/repair-job-tracking/components/repair-job-table/constants';
import BaseTable from '@/shared/base-table';
import QueryResponse from '@/shared/query-response';
import { TableNames, TechnicianRecord } from '@/shared/types';

import useFetchTechnicianRecords from '../../hooks/useFetchTechnicianRecords';

import { TECHNICIAN_RECORD_COLUMNS } from './columns';
import { DEFAULT_TECHNICIAN_RECORD_TABLE_ROW_TOOLTIP_MESSAGE } from './constants';

const TechnicianManagementTable = () => {
  const { technicianRecords, onNext, refetch, hasMore, error, loading } = useFetchTechnicianRecords();

  return (
    <>
      <QueryResponse errorDescription={error} errorMessage='Failed to fetch technician record data' />
      <BaseTable<TechnicianRecord, QueryGetTechnicianRecordsArgs, GetTechnicianRecordsQuery>
        className='h-[48rem]'
        columns={TECHNICIAN_RECORD_COLUMNS}
        data={technicianRecords}
        emptyTableMessage=''
        errorMessage={error}
        filtersConfig={[]}
        hasMore={hasMore}
        loadMore={onNext}
        loading={loading}
        refetch={refetch}
        rowTooltipMessage={DEFAULT_TECHNICIAN_RECORD_TABLE_ROW_TOOLTIP_MESSAGE}
        searchFieldPlaceholder={DEFAULT_SEARCH_INPUT_PLACEHOLDER}
        tableName={TableNames.TechnicianManagementTable}
        tableStorageState={{}}
        onHandleRowClick={() => {}}
        onSetTableStorageState={() => {}}
      />
    </>
  );
};

export default TechnicianManagementTable;
