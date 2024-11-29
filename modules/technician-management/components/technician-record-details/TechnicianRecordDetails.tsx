import { useMemo } from 'react';

import { useRouter } from 'next/router';

import BaseDetailsPage from '@/shared/base-details-page';
import { getTechnicianDetailsPageActionButtonsConfig } from '@/shared/base-details-page/utils';

import { technicianRecordSectionsConfig } from './config';
import { useFetchTechnicianRecordById } from './hooks';

const TechnicianRecordDetails = () => {
  const {
    query: { technicianRecordId },
    back,
  } = useRouter();

  const { technicianRecord, loading, error } = useFetchTechnicianRecordById(technicianRecordId as string);

  const technicianRecordDetailsSections = useMemo(
    () => technicianRecordSectionsConfig(technicianRecord),
    [technicianRecord]
  );

  const actionButtonsConfig = useMemo(
    () => getTechnicianDetailsPageActionButtonsConfig({ onOpenEditModal: () => console.log('Edit') }),
    []
  );

  return (
    <BaseDetailsPage
      actionButtonsConfig={actionButtonsConfig}
      detailsPageSections={technicianRecordDetailsSections}
      error={error}
      errorMessage={`Failed to fetch Technician Record Details by ${technicianRecordId}`}
      loading={loading}
      modalConfig={[]}
      title={`${technicianRecord.name}'s Record Details`}
    />
  );
};

export default TechnicianRecordDetails;
