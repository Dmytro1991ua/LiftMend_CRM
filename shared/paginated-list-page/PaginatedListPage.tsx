import { useMemo } from 'react';

import InfiniteScroll from 'react-infinite-scroll-component';
import { Bars } from 'react-loader-spinner';

import { cn } from '@/lib/utils';

import GoBackButton from '../base-button/go-back-button';
import { getDataLoadStatusView } from '../config';
import SectionHeader from '../section-header';
import { getDerivedDataLoadStatus } from '../utils';

export type PaginatedListPageProps = {
  sectionTitle: string;
  controls?: JSX.Element;
  isInitialLoading: boolean;
  isEmpty: boolean;
  errorMessage?: string;
  errorTitle: string;
  emptyStateMessage: string;
  hasMore: boolean;
  onNext: () => void;
  totalItems: number;
  children?: React.ReactNode;
  sectionSubtitle?: string;
};

const PaginatedListPage = ({
  sectionTitle,
  totalItems,
  controls,
  children,
  isInitialLoading,
  isEmpty,
  errorMessage,
  errorTitle,
  emptyStateMessage,
  hasMore,
  sectionSubtitle,
  onNext,
}: PaginatedListPageProps) => {
  const dataLoadStatus = getDerivedDataLoadStatus(isEmpty, isInitialLoading, errorMessage);

  const dataLoadStatusView = useMemo(
    () => getDataLoadStatusView({ errorMessage, errorTitle, emptyStateMessage }),
    [errorMessage, errorTitle, emptyStateMessage]
  );

  return (
    <section>
      <SectionHeader
        actionComponent={controls}
        goBackButton={<GoBackButton />}
        subtitle={sectionSubtitle}
        title={sectionTitle}
      />
      {dataLoadStatus && dataLoadStatusView[dataLoadStatus]}
      <div className={cn('flex flex-column h-dvh content-wrapper')}>
        <div className='h-[60rem] overflow-y-auto w-full' id='scrollable-paginated-list'>
          <InfiniteScroll
            dataLength={totalItems}
            hasMore={hasMore}
            loader={
              <Bars
                ariaLabel='bars-loading'
                color='#306cce'
                height='30'
                visible={hasMore}
                width='30'
                wrapperClass='justify-center py-2'
              />
            }
            next={onNext}
            scrollThreshold={0.99}
            scrollableTarget='scrollable-paginated-list'
          >
            {children}
          </InfiniteScroll>
        </div>
      </div>
    </section>
  );
};

export default PaginatedListPage;
