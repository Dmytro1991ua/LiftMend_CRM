import { useCallback, useMemo } from 'react';

import { Row } from '@tanstack/react-table';
import { useRouter } from 'next/router';

import { GetTechnicianRecordsQuery, QueryGetTechnicianRecordsArgs } from '@/graphql/types/client/generated_types';
import BaseTable from '@/shared/base-table';
import { useSearchInTable } from '@/shared/base-table/hooks';
import { getEmptyTableMessage, onHandleRowClick } from '@/shared/base-table/utils';
import { useFetchDropdownOptions } from '@/shared/hooks/useFetchDropdownOptions';
import { DropdownOptions } from '@/shared/hooks/useFetchDropdownOptions/config';
import QueryResponse from '@/shared/query-response';
import { TableNames, TechnicianRecord } from '@/shared/types';
import { AppRoutes } from '@/types/enums';

import { useFetchTechnicianRecords } from '../../hooks';

import { TECHNICIAN_RECORD_COLUMNS } from './columns';
import { getTechnicianRecordFilterConfig } from './config';
import { DEFAULT_SEARCH_INPUT_PLACEHOLDER, DEFAULT_TECHNICIAN_RECORDS_TABLE_EMPTY_TABLE_MESSAGE } from './constants';
import { getRowTooltipMessage, isTechnicianRecordRowDisabled } from './utils';

const TechnicianManagementTable = () => {
  const router = useRouter();

  const { technicianRecords, onNext, refetch, onSetTableStorageState, tableStorageState, hasMore, error, loading } =
    useFetchTechnicianRecords<TechnicianRecord>();

  const { searchTerm } = useSearchInTable<TechnicianRecord, QueryGetTechnicianRecordsArgs, GetTechnicianRecordsQuery>({
    tableStorageState,
    onSetTableStorageState,
    refetch,
  });

  const { dropdownOptions, error: technicianRecordDataError } = useFetchDropdownOptions<GetTechnicianRecordsQuery>({
    configKey: DropdownOptions.TechnicianManagement,
  });

  const filtersConfig = useMemo(() => getTechnicianRecordFilterConfig(dropdownOptions), [dropdownOptions]);

  const emptyTableMessage = useMemo(
    () =>
      getEmptyTableMessage(
        searchTerm,
        !!technicianRecords.length,
        DEFAULT_TECHNICIAN_RECORDS_TABLE_EMPTY_TABLE_MESSAGE
      ),
    [searchTerm, technicianRecords.length]
  );

  const onTechnicianRecordRowClick = useCallback(
    (rowData: Row<TechnicianRecord>) => {
      const {
        original: { id },
      } = rowData;

      onHandleRowClick({ id, route: AppRoutes.TechnicianManagement, router });
    },
    [router]
  );

  return (
    <>
      <QueryResponse
        errorDescription={technicianRecordDataError}
        errorMessage='Failed to fetch technician record data'
        isErrorOccurred={!!technicianRecordDataError}
      />
      <BaseTable<TechnicianRecord, QueryGetTechnicianRecordsArgs, GetTechnicianRecordsQuery>
        className='h-[48rem]'
        columns={TECHNICIAN_RECORD_COLUMNS}
        data={technicianRecords}
        emptyTableMessage={emptyTableMessage}
        errorMessage={error}
        filtersConfig={filtersConfig}
        hasMore={hasMore}
        isRowDisabled={isTechnicianRecordRowDisabled}
        loadMore={onNext}
        loading={loading}
        refetch={refetch}
        rowTooltipMessage={getRowTooltipMessage}
        searchFieldPlaceholder={DEFAULT_SEARCH_INPUT_PLACEHOLDER}
        tableName={TableNames.TechnicianManagementTable}
        tableStorageState={tableStorageState}
        onHandleRowClick={onTechnicianRecordRowClick}
        onSetTableStorageState={onSetTableStorageState}
      />
    </>
  );
};

export default TechnicianManagementTable;
