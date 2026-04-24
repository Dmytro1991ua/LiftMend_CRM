import React from 'react';

import SectionHeader from '@/shared/section-header';
import { SectionHeaderDescription, SectionHeaderTitle } from '@/types/enums';

import InventoryPartsTable from './components/inventory-parts-table';

const InventoryManagement = () => {
  return (
    <div className='flex flex-col'>
      <SectionHeader
        subtitle={SectionHeaderDescription.InventoryManagement}
        title={SectionHeaderTitle.InventoryManagement}
      />
      <div className='content-wrapper'>
        <InventoryPartsTable />
      </div>
    </div>
  );
};

export default InventoryManagement;
