import React from 'react';

import SectionHeader from '@/shared/section-header';
import { SectionHeaderDescription, SectionHeaderTitle } from '@/types/enums';

const InventoryManagement = () => {
  return (
    <div className='flex flex-col'>
      <SectionHeader
        subtitle={SectionHeaderDescription.InventoryManagement}
        title={SectionHeaderTitle.InventoryManagement}
      />
      <div className='content-wrapper'>Inventory Management Component</div>
    </div>
  );
};

export default InventoryManagement;
