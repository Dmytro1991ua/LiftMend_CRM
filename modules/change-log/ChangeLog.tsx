import { Accordion } from '@/components/ui/accordion';
import PaginatedListPage from '@/shared/paginated-list-page';

import ChangeLogContent from './change-log-content';
import ChangeLogItem from './change-log-item';
import {
  DEFAULT_CHANGE_LOG_PAGE_DESCRIPTION,
  DEFAULT_CHANGE_LOG_PAGE_TITLE,
  DEFAULT_EMPTY_CHANGE_LOG_PAGE_MESSAGE,
  DEFAULT_ERROR_RESPONSE_MESSAGE,
} from './constants';
import { useGetChangeLogs } from './hooks/useGetChangeLogs';

const ChangeLog = () => {
  const { changeLogs, isInitialLoading, isChangeLogEmpty, hasMore, totalChangeLogsLength, error, onNext } =
    useGetChangeLogs();

  return (
    <PaginatedListPage
      emptyStateMessage={DEFAULT_EMPTY_CHANGE_LOG_PAGE_MESSAGE}
      errorMessage={error}
      errorTitle={DEFAULT_ERROR_RESPONSE_MESSAGE}
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
