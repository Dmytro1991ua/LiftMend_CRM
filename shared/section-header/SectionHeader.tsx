import React from 'react';

import { SectionHeaderTitle } from '@/types/enums';

type SectionHeaderProps = {
  title: SectionHeaderTitle;
  subtitle?: string;
  actionComponent?: React.JSX.Element;
};

const SectionHeader = ({ title, subtitle, actionComponent }: SectionHeaderProps): React.JSX.Element => {
  const headerActions = <>{actionComponent ? actionComponent : null}</>;

  return (
    <section className='flex items-center mb-5'>
      <div>
        <h3 className='text-link mr-2'>{subtitle}</h3>
        <h2 className='text-2xl font-bold'>{title}</h2>
      </div>
      <div className='ml-auto' data-testid='header-actions'>
        {headerActions}
      </div>
    </section>
  );
};

export default SectionHeader;
