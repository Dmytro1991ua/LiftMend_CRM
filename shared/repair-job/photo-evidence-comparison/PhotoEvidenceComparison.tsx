import { useMemo } from 'react';

import BaseCard from '@/shared/base-card';

import { getPhotoEvidenceConfig } from './config';

export type PhotoEvidenceComparisonProps = {
  beforePhotoUrl: string;
  afterPhotoUrl?: string | null;
};

const PhotoEvidenceComparison = ({ beforePhotoUrl, afterPhotoUrl }: PhotoEvidenceComparisonProps) => {
  const photoEvidenceConfig = useMemo(
    () => getPhotoEvidenceConfig(beforePhotoUrl, afterPhotoUrl) || {},
    [beforePhotoUrl, afterPhotoUrl]
  );

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      {photoEvidenceConfig.map(
        ({ id, title, content, cardTittleClassName, cardHeaderClassName, cardContentClassName }) => (
          <BaseCard
            key={id}
            cardContentClassName={cardContentClassName}
            cardHeaderClassName={cardHeaderClassName}
            cardTittleClassName={cardTittleClassName}
            title={title}
          >
            {content}
          </BaseCard>
        )
      )}
    </div>
  );
};

export default PhotoEvidenceComparison;
