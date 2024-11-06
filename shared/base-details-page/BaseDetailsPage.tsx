import { Audio } from 'react-loader-spinner';

import BaseAlert from '../base-alert/BaseAlert';
import QueryResponse from '../query-response';
import { ItemConfig } from '../types';

import DetailsPageContent from './details-page-content';
import DetailsPageHeader from './details-page-header';
import { DetailsPageSectionsConfig } from './types';

type BaseDetailsPageProps = {
  error?: string;
  loading: boolean;
  errorMessage: string;
  detailsPageSections: DetailsPageSectionsConfig[];
  onOpenDeleteModal: () => void;
  onOpenEditModal: () => void;
  title: string;
  description: string;
  modalConfig: ItemConfig[];
};

const BaseDetailsPage = ({
  error,
  errorMessage,
  detailsPageSections,
  description,
  onOpenDeleteModal,
  onOpenEditModal,
  title,
  loading,
  modalConfig,
}: BaseDetailsPageProps) => {
  return (
    <section>
      <DetailsPageHeader
        description={description}
        loading={loading}
        title={title}
        onOpenDeleteModal={onOpenDeleteModal}
        onOpenEditModal={onOpenEditModal}
      />
      <div className='content-wrapper h-[72vh] overflow-y-auto overflow-x-hidden'>
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
