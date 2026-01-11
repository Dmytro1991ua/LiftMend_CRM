import { Accordion } from '@/components/ui/accordion';
import PaginatedListPage from '@/shared/paginated-list-page';

import ChangeLogContent from './change-log-content';
import ChangeLogControls from './change-log-controls';
import ChangeLogItem from './change-log-item';
import {
  DEFAULT_CHANGE_LOG_FILTER_DATA_FETCH_ERROR_RESPONSE_MESSAGE,
  DEFAULT_CHANGE_LOG_PAGE_DESCRIPTION,
  DEFAULT_CHANGE_LOG_PAGE_TITLE,
  DEFAULT_EMPTY_CHANGE_LOG_PAGE_MESSAGE,
} from './constants';
import { useGetChangeLogs } from './hooks/useGetChangeLogs';

const ChangeLog = () => {
  const {
    changeLogs,
    isInitialLoading,
    isChangeLogEmpty,
    hasMore,
    totalChangeLogsLength,
    error,
    changeLogPageStoredState,
    isCalendarOpen,
    sanitizedDateRange,
    onHandleCalendarPopoverClose,
    onSetChangeLogPageStoredState,
    onNext,
  } = useGetChangeLogs();

  return (
    <PaginatedListPage
      controls={
        <ChangeLogControls
          changeLogPageStoredState={changeLogPageStoredState}
          isCalendarOpen={isCalendarOpen}
          isDisabled={isChangeLogEmpty}
          sanitizedDateRange={sanitizedDateRange}
          onHandleCalendarPopoverClose={onHandleCalendarPopoverClose}
          onSetChangeLogPageStoredState={onSetChangeLogPageStoredState}
        />
      }
      emptyStateMessage={DEFAULT_EMPTY_CHANGE_LOG_PAGE_MESSAGE}
      errorMessage={error}
      errorTitle={DEFAULT_CHANGE_LOG_FILTER_DATA_FETCH_ERROR_RESPONSE_MESSAGE}
      hasMore={hasMore}
      isEmpty={isChangeLogEmpty}
      isInitialLoading={isInitialLoading}
      sectionSubtitle={DEFAULT_CHANGE_LOG_PAGE_DESCRIPTION}
      sectionTitle={DEFAULT_CHANGE_LOG_PAGE_TITLE}
      totalItems={totalChangeLogsLength}
      onNext={onNext}
    >
      <Accordion collapsible type='single'>
        {changeLogs.map(({ id, createdAt, modifiedBy, entityType, changeList }) => (
          <ChangeLogItem key={id} createdAt={createdAt} entityType={entityType} id={id} modifiedBy={modifiedBy}>
            <ChangeLogContent changeList={changeList} />
          </ChangeLogItem>
        ))}
      </Accordion>
    </PaginatedListPage>
  );
};

export default ChangeLog;
