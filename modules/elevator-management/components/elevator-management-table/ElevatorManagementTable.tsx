import BaseTable from '@/shared/base-table/BaseTable';
import { ElevatorRecord, TableNames } from '@/shared/types';

import { DEFAULT_ELEVATOR_MANAGEMENT_SEARCH_INPUT_PLACEHOLDER } from '../../constants';
import useGetElevatorRecords from '../../hooks/useGetElevatorRecords';

import { ELEVATOR_MANAGEMENT_COLUMNS } from './columns';

const ElevatorManagementTable = () => {
  const { elevatorRecords, error, loading, hasMore, onNext } = useGetElevatorRecords();

  return (
    <BaseTable<ElevatorRecord, unknown, unknown>
      className='h-[48rem]'
      columns={ELEVATOR_MANAGEMENT_COLUMNS}
      data={elevatorRecords}
      errorMessage={error}
      filtersConfig={[]}
      hasMore={hasMore}
      loadMore={onNext}
      loading={loading}
      refetch={() => null!}
      searchFieldPlaceholder={DEFAULT_ELEVATOR_MANAGEMENT_SEARCH_INPUT_PLACEHOLDER}
      tableName={TableNames.ElevatorManagementTable}
      tableStorageState={{}}
      onHandleRowClick={() => {}}
      onSetTableStorageState={() => {}}
    />
  );
};

export default ElevatorManagementTable;
