import { useMemo } from 'react';

import { GetChangeLogsQuery } from '@/graphql/types/client/generated_types';
import usePageFilters from '@/shared/base-table/hooks/useFilterInTable';
import PageFilters from '@/shared/base-table/table-filters';
import { useFetchDropdownOptions } from '@/shared/hooks/useFetchDropdownOptions';
import { DropdownOptions } from '@/shared/hooks/useFetchDropdownOptions/config';
import QueryResponse from '@/shared/query-response';

import { DEFAULT_CHANGE_LOG_FILTER_DATA_FETCH_ERROR_RESPONSE_MESSAGE } from '../constants';
import { ChangeLogState } from '../types';

import { getChangeLogPageFiltersConfig } from './config';

const ChangeLogControls = ({
  changeLogPageStoredState,
  onSetChangeLogPageStoredState,
}: Pick<ChangeLogState, 'changeLogPageStoredState' | 'onSetChangeLogPageStoredState'>) => {
  const { dropdownOptions, error } = useFetchDropdownOptions<GetChangeLogsQuery>({
    configKey: DropdownOptions.ChangeLog,
  });

  const { filters, onFilterChange, onClearFilter } = usePageFilters({
    tableStorageState: changeLogPageStoredState,
    onSetTableStorageState: onSetChangeLogPageStoredState,
  });

  const changeLogFilters = useMemo(() => getChangeLogPageFiltersConfig(dropdownOptions), [dropdownOptions]);

  return (
    <section className='flex items-center gap-2' data-testid='change-log-controls'>
      <QueryResponse
        errorDescription={error}
        errorMessage={DEFAULT_CHANGE_LOG_FILTER_DATA_FETCH_ERROR_RESPONSE_MESSAGE}
        isErrorOccurred={!!error}
      />
      <PageFilters
        isAccordionAutoHeight
        filtersConfig={changeLogFilters}
        storedFilters={filters}
        onClearFilter={onClearFilter}
        onFilterChange={onFilterChange}
      />
    </section>
  );
};

export default ChangeLogControls;
