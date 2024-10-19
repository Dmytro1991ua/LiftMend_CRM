import { useMemo } from 'react';

import { GetElevatorRecordsQuery, QueryGetElevatorRecordsArgs } from '@/graphql/types/client/generated_types';
import BaseTable from '@/shared/base-table/BaseTable';
import useSearchInTable from '@/shared/base-table/hooks/useSearchInTable';
import { getEmptyTableMessage } from '@/shared/base-table/utils';
import { useFetchDropdownOptions } from '@/shared/hooks/useFetchDropdownOptions';
import { DropdownOptions } from '@/shared/hooks/useFetchDropdownOptions/config';
import QueryResponse from '@/shared/query-response';
import { ElevatorRecord, TableNames } from '@/shared/types';

import {
  DEFAULT_ELEVATOR_MANAGEMENT_SEARCH_INPUT_PLACEHOLDER,
  DEFAULT_ELEVATOR_RECORDS_TABLE_EMPTY_TABLE_MESSAGE,
} from '../../constants';
import useGetElevatorRecords from '../../hooks/useGetElevatorRecords';

import { ELEVATOR_MANAGEMENT_COLUMNS } from './columns';
import { getElevatorRecordFilterConfig } from './config';

const ElevatorManagementTable = () => {
  const { elevatorRecords, error, loading, hasMore, onNext, tableStorageState, onSetTableStorageState, refetch } =
    useGetElevatorRecords<ElevatorRecord>();

  const { searchTerm } = useSearchInTable<ElevatorRecord, QueryGetElevatorRecordsArgs, GetElevatorRecordsQuery>({
    tableStorageState,
    onSetTableStorageState,
    refetch,
  });

  const { dropdownOptions, error: elevatorRecordDataError } = useFetchDropdownOptions<GetElevatorRecordsQuery>(
    DropdownOptions.ElevatorManagement
  );

  const filtersConfig = useMemo(() => getElevatorRecordFilterConfig(dropdownOptions), [dropdownOptions]);

  const emptyTableMessage = useMemo(
    () =>
      getEmptyTableMessage(searchTerm, !!elevatorRecords.length, DEFAULT_ELEVATOR_RECORDS_TABLE_EMPTY_TABLE_MESSAGE),
    [searchTerm, elevatorRecords.length]
  );

  return (
    <>
      <QueryResponse errorDescription={elevatorRecordDataError} errorMessage='Failed to fetch elevator record data' />
      <BaseTable<ElevatorRecord, QueryGetElevatorRecordsArgs, GetElevatorRecordsQuery>
        className='h-[48rem]'
        columns={ELEVATOR_MANAGEMENT_COLUMNS}
        data={elevatorRecords}
        emptyTableMessage={emptyTableMessage}
        errorMessage={error}
        filtersConfig={filtersConfig}
        hasMore={hasMore}
        loadMore={onNext}
        loading={loading}
        refetch={refetch}
        searchFieldPlaceholder={DEFAULT_ELEVATOR_MANAGEMENT_SEARCH_INPUT_PLACEHOLDER}
        tableName={TableNames.ElevatorManagementTable}
        tableStorageState={tableStorageState}
        onHandleRowClick={() => {}}
        onSetTableStorageState={onSetTableStorageState}
      />
    </>
  );
};

export default ElevatorManagementTable;
