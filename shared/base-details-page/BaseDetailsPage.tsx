import { Audio } from 'react-loader-spinner';

import BaseAlert from '../base-alert/BaseAlert';
import QueryResponse from '../query-response';
import { ItemConfig } from '../types';

import DetailsPageContent from './details-page-content';
import DetailsPageHeader from './details-page-header';
import { DetailsPageActionButtonConfig, DetailsPageSectionsConfig } from './types';

type BaseDetailsPageProps = {
  error?: string;
  loading: boolean;
  errorMessage: string;
  detailsPageSections: DetailsPageSectionsConfig[];
  title: string;
  description?: string;
  modalConfig: ItemConfig[];
  actionButtonsConfig: DetailsPageActionButtonConfig[];
};

const BaseDetailsPage = ({
  error,
  errorMessage,
  detailsPageSections,
  description,
  title,
  loading,
  modalConfig,
  actionButtonsConfig,
}: BaseDetailsPageProps) => {
  return (
    <section>
      <DetailsPageHeader
        actionButtonsConfig={actionButtonsConfig}
        description={description}
        loading={loading}
        title={title}
      />
      <div className='content-wrapper h-[71vh] overflow-y-auto overflow-x-hidden'>
        <>
          <QueryResponse
            errorComponent={<BaseAlert description={error} title={errorMessage} variant='destructive' />}
            isErrorOccurred={!!error}
            loading={loading}
            loadingComponent={
              <Audio
                ariaLabel='bars-loading'
                color='#2563eb'
                height='80'
                visible={true}
                width='80'
                wrapperClass='h-full items-center justify-center'
              />
            }
          />
          <DetailsPageContent detailsPageSections={detailsPageSections} error={error} loading={loading} />
        </>
      </div>
      {modalConfig.map((config) => (
        <div key={config.id}>{config.content}</div>
      ))}
    </section>
  );
};

export default BaseDetailsPage;
