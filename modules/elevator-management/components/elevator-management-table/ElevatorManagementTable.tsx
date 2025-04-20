import { useCallback, useMemo } from 'react';

import { Row } from '@tanstack/react-table';
import { useRouter } from 'next/router';

import { GetElevatorRecordsQuery, QueryGetElevatorRecordsArgs } from '@/graphql/types/client/generated_types';
import { DEFAULT_ELEVATOR_RECORD_TABLE_ROW_TOOLTIP_MESSAGE } from '@/modules/repair-job-scheduling/constants';
import BaseTable from '@/shared/base-table/BaseTable';
import { getEmptyTableMessage, onHandleRowClick } from '@/shared/base-table/utils';
import { useFetchDropdownOptions } from '@/shared/hooks/useFetchDropdownOptions';
import { DropdownOptions } from '@/shared/hooks/useFetchDropdownOptions/config';
import QueryResponse from '@/shared/query-response';
import { ElevatorRecord, TableNames } from '@/shared/types';
import { AppRoutes } from '@/types/enums';

import {
  DEFAULT_ELEVATOR_MANAGEMENT_SEARCH_INPUT_PLACEHOLDER,
  DEFAULT_ELEVATOR_RECORDS_TABLE_EMPTY_TABLE_MESSAGE,
} from '../../constants';
import useGetElevatorRecords from '../../hooks/useGetElevatorRecords';

import { ELEVATOR_MANAGEMENT_COLUMNS } from './columns';
import { getElevatorRecordFilterConfig } from './config';
import { isElevatorRecordRowDisabled } from './utils';
import { useSearchInTable } from '@/shared/base-table/hooks';

const ElevatorManagementTable = () => {
  const router = useRouter();

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

  const onElevatorRecordRowClick = useCallback(
    (rowData: Row<ElevatorRecord>) => {
      const {
        original: { id },
      } = rowData;

      onHandleRowClick({ id, route: AppRoutes.ElevatorManagement, router });
    },
    [router]
  );

  return (
    <>
      <QueryResponse
        errorDescription={elevatorRecordDataError}
        errorMessage='Failed to fetch elevator record data'
        isErrorOccurred={!!elevatorRecordDataError}
      />
      <BaseTable<ElevatorRecord, QueryGetElevatorRecordsArgs, GetElevatorRecordsQuery>
        className='h-[48rem]'
        columns={ELEVATOR_MANAGEMENT_COLUMNS}
        data={elevatorRecords}
        emptyTableMessage={emptyTableMessage}
        errorMessage={error}
        filtersConfig={filtersConfig}
        hasMore={hasMore}
        isRowDisabled={isElevatorRecordRowDisabled}
        loadMore={onNext}
        loading={loading}
        refetch={refetch}
        rowTooltipMessage={DEFAULT_ELEVATOR_RECORD_TABLE_ROW_TOOLTIP_MESSAGE}
        searchFieldPlaceholder={DEFAULT_ELEVATOR_MANAGEMENT_SEARCH_INPUT_PLACEHOLDER}
        tableName={TableNames.ElevatorManagementTable}
        tableStorageState={tableStorageState}
        onHandleRowClick={onElevatorRecordRowClick}
        onSetTableStorageState={onSetTableStorageState}
      />
    </>
  );
};

export default ElevatorManagementTable;
