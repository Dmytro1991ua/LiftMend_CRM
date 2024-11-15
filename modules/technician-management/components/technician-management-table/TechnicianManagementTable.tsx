import { GetTechnicianRecordsQuery, QueryGetTechnicianRecordsArgs } from '@/graphql/types/client/generated_types';
import { DEFAULT_SEARCH_INPUT_PLACEHOLDER } from '@/modules/repair-job-tracking/components/repair-job-table/constants';
import BaseTable from '@/shared/base-table';
import QueryResponse from '@/shared/query-response';
import { TableNames, TechnicianRecord } from '@/shared/types';

import useFetchTechnicianRecords from '../../hooks/useFetchTechnicianRecords';

import { TECHNICIAN_RECORD_COLUMNS } from './columns';
import { getRowTooltipMessage, isTechnicianRecordRowDisabled } from './utils';

const TechnicianManagementTable = () => {
  const { technicianRecords, onNext, refetch, hasMore, error, loading } = useFetchTechnicianRecords();

  return (
    <>
      <QueryResponse
        errorDescription={error}
        errorMessage='Failed to fetch technician record data'
        isErrorOccurred={!!error}
      />
      <BaseTable<TechnicianRecord, QueryGetTechnicianRecordsArgs, GetTechnicianRecordsQuery>
        className='h-[48rem]'
        columns={TECHNICIAN_RECORD_COLUMNS}
        data={technicianRecords}
        emptyTableMessage=''
        errorMessage={error}
        filtersConfig={[]}
        hasMore={hasMore}
        isRowDisabled={isTechnicianRecordRowDisabled}
        loadMore={onNext}
        loading={loading}
        refetch={refetch}
        rowTooltipMessage={getRowTooltipMessage}
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
