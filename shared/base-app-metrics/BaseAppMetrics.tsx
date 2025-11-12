import { Bars } from 'react-loader-spinner';

import BaseCard from '@/shared/base-card';
import QueryResponse from '@/shared/query-response';

import { DEFAULT_ERROR_RESPONSE_MESSAGE } from './constants';
import SectionWrapper from './section-wrapper';
import { BaseMetricsConfig } from './types';

export type BaseAppMetricsProps<T, K> = {
  metricsConfig: BaseMetricsConfig<K>[];
  sectionTitle?: T;
  loading: boolean;
  error?: string;
};

const BaseAppMetrics = <T extends string, K extends string>({
  metricsConfig,
  error,
  loading,
  sectionTitle,
}: BaseAppMetricsProps<T, K>) => {
  return (
    <div className='mb-6' data-testid='base-app-metrics'>
      <QueryResponse errorDescription={error} errorMessage={DEFAULT_ERROR_RESPONSE_MESSAGE} isErrorOccurred={!!error} />
      <SectionWrapper title={sectionTitle}>
        <div className='flex gap-2 overflow-x-auto'>
          {metricsConfig.map(
            ({
              id,
              cardClassName,
              cardContentClassName,
              cardHeaderClassName,
              cardTittleClassName,
              title,
              metric,
              icon,
              infoTooltip,
            }) => (
              <BaseCard
                key={id}
                cardClassName={cardClassName}
                cardContentClassName={cardContentClassName}
                cardHeaderClassName={cardHeaderClassName}
                cardTittleClassName={cardTittleClassName}
                icon={icon}
                infoTooltip={infoTooltip}
                title={title}
              >
                {loading ? (
                  <Bars
                    ariaLabel='bars-loading'
                    color='#2563eb'
                    height='50'
                    visible={true}
                    width='50'
                    wrapperClass='justify-center'
                  />
                ) : (
                  <h3 className='text-3xl font-bold text-center'>{metric}</h3>
                )}
              </BaseCard>
            )
          )}
        </div>
      </SectionWrapper>
    </div>
  );
};

export default BaseAppMetrics;
