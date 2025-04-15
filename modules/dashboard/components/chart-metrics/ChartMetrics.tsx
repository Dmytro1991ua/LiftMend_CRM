import { Bars } from 'react-loader-spinner';

import BaseCard from '@/shared/base-card';
import BaseChart from '@/shared/base-charts';
import { AdditionalChatConfigFields, ChartConfig, ChartData, ChartType } from '@/shared/base-charts/types';
import QueryResponse from '@/shared/query-response';

import { SectionTitle } from '../../types';
import SectionWrapper from '../section-wrapper';

type CardDetails = {
  title: string;
  description: string;
};

export type ChartMetricsProps = {
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

const ChartMetrics = ({
  className,
  sectionTitle,
  chartConfig,
  loading,
  error,
  cardDetails,
  chartType,
  chartData,
  additionalChartConfigFields,
}: ChartMetricsProps) => {
  const { title, description } = cardDetails;

  return (
    <>
      <QueryResponse errorDescription={error} errorMessage='An error occurred' isErrorOccurred={!!error} />
      <section className={className}>
        <SectionWrapper title={sectionTitle}>
          <BaseCard
            cardClassName='bg-blue-100'
            cardDescriptionClassName='text-white'
            cardHeaderClassName='bg-primary text-white text-lg items-center'
            description={description}
            title={title}>
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
                additionalChartConfigFields={additionalChartConfigFields}
                chartType={chartType}
                className='w-full h-auto'
                config={chartConfig}
                data={chartData}
              />
            )}
          </BaseCard>
        </SectionWrapper>
      </section>
    </>
  );
};

export default ChartMetrics;
