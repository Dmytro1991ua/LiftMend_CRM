import { useMemo } from 'react';

import { Bars } from 'react-loader-spinner';

import BaseCard from '@/shared/base-card';
import QueryResponse from '@/shared/query-response';

import { DashboardSectionProps, SectionTitle } from '../../types';
import SectionWrapper from '../section-wrapper/SectionWrapper';

import { DEFAULT_ERROR_RESPONSE_MESSAGE } from './constants';
import { getKeyMetricsConfig } from './utils';

const KeyAppMetrics = ({ error, loading, dashboardMetrics }: DashboardSectionProps) => {
  const dashboardMetricsConfig = useMemo(() => getKeyMetricsConfig(dashboardMetrics), [dashboardMetrics]);

  return (
    <div data-testid='key-app-metrics'>
      <QueryResponse errorDescription={error} errorMessage={DEFAULT_ERROR_RESPONSE_MESSAGE} isErrorOccurred={!!error} />
      <SectionWrapper title={SectionTitle.KeyAppMetrics}>
        <div className='flex gap-2 overflow-x-auto'>
          {dashboardMetricsConfig.map(
            ({
              id,
              cardClassName,
              cardContentClassName,
              cardHeaderClassName,
              cardTittleClassName,
              title,
              metric,
              icon,
            }) => (
              <BaseCard
                key={id}
                cardClassName={cardClassName}
                cardContentClassName={cardContentClassName}
                cardHeaderClassName={cardHeaderClassName}
                cardTittleClassName={cardTittleClassName}
                icon={icon}
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

export default KeyAppMetrics;
