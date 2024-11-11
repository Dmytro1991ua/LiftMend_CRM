import { useMemo } from 'react';

import { GetTechnicianRecordsQuery, QueryGetTechnicianRecordsArgs } from '@/graphql/types/client/generated_types';
import BaseTable from '@/shared/base-table';
import useSearchInTable from '@/shared/base-table/hooks/useSearchInTable';
import { getEmptyTableMessage } from '@/shared/base-table/utils';
import QueryResponse from '@/shared/query-response';
import { TableNames, TechnicianRecord } from '@/shared/types';

import useFetchTechnicianRecords from '../../hooks/useFetchTechnicianRecords';

import { TECHNICIAN_RECORD_COLUMNS } from './columns';
import {
  DEFAULT_SEARCH_INPUT_PLACEHOLDER,
  DEFAULT_TECHNICIAN_RECORDS_TABLE_EMPTY_TABLE_MESSAGE,
  DEFAULT_TECHNICIAN_RECORD_TABLE_ROW_TOOLTIP_MESSAGE,
} from './constants';

const TechnicianManagementTable = () => {
  const { technicianRecords, onNext, refetch, onSetTableStorageState, tableStorageState, hasMore, error, loading } =
    useFetchTechnicianRecords<TechnicianRecord>();

  const { searchTerm } = useSearchInTable<TechnicianRecord, QueryGetTechnicianRecordsArgs, GetTechnicianRecordsQuery>({
    tableStorageState,
    onSetTableStorageState,
    refetch,
  });

  const emptyTableMessage = useMemo(
    () =>
      getEmptyTableMessage(
        searchTerm,
        !!technicianRecords.length,
        DEFAULT_TECHNICIAN_RECORDS_TABLE_EMPTY_TABLE_MESSAGE
      ),
    [searchTerm, technicianRecords.length]
  );

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
        emptyTableMessage={emptyTableMessage}
        errorMessage={error}
        filtersConfig={[]}
        hasMore={hasMore}
        loadMore={onNext}
        loading={loading}
        refetch={refetch}
        rowTooltipMessage={DEFAULT_TECHNICIAN_RECORD_TABLE_ROW_TOOLTIP_MESSAGE}
        searchFieldPlaceholder={DEFAULT_SEARCH_INPUT_PLACEHOLDER}
        tableName={TableNames.TechnicianManagementTable}
        tableStorageState={tableStorageState}
        onHandleRowClick={() => {}}
        onSetTableStorageState={onSetTableStorageState}
      />
    </>
  );
};

export default TechnicianManagementTable;
