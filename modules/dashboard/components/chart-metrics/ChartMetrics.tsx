import { AdditionalChatConfigFields, ChartConfig, ChartData, ChartType } from '@/shared/base-charts/types';
import QueryResponse from '@/shared/query-response';
import { useMemo } from 'react';
import SectionWrapper from '../section-wrapper';
import BaseCard from '@/shared/base-card';
import { Bars } from 'react-loader-spinner';
import { SectionTitle } from '../../types';
import BaseChart from '@/shared/base-charts';

type CardDetails = {
  title: string;
  description: string;
};

type ChartMetricsProps<T> = {
  className?: string;
  sectionTitle: SectionTitle;
  cardDetails: CardDetails;
  chartConfig: ChartConfig;
  loading: boolean;
  error?: string;
  chartType: ChartType;
  chartData: ChartData[];
  additionalChartConfigFields: AdditionalChatConfigFields;
};

const ChartMetrics = <T,>({
  className,
  sectionTitle,
  chartConfig,
  loading,
  error,
  cardDetails,
  chartType,
  chartData,
  additionalChartConfigFields,
}: ChartMetricsProps<T>) => {
  const { title, description } = cardDetails;

  return (
    <>
      <QueryResponse errorDescription={error} errorMessage='An error occurred' isErrorOccurred={!!error} />
      <section className={className}>
        <SectionWrapper title={sectionTitle}>
          <BaseCard
            cardClassName={'bg-blue-100'}
            cardHeaderClassName='bg-primary text-white text-lg items-center'
            cardDescriptionClassName='text-white'
            title={title}
            description={description}>
            {loading ? (
              <Bars
                ariaLabel='bars-loading'
                color='#2563eb'
                height='80'
                visible={true}
                width='80'
                wrapperClass='justify-center'
              />
            ) : (
              <BaseChart
                data={chartData}
                config={chartConfig}
                chartType={chartType}
                additionalChartConfigFields={additionalChartConfigFields}
                className='w-full h-auto'
              />
            )}
          </BaseCard>
        </SectionWrapper>
      </section>
    </>
  );
};

export default ChartMetrics;
