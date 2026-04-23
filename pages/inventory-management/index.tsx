import InventoryManagement from '@/modules/inventory-management';
import MainLayout from '@/modules/layout/MainLayout';
import { NextPageWithLayout } from '@/shared/types';

const InventoryManagementPage: NextPageWithLayout = () => {
  return <InventoryManagement />;
};

InventoryManagementPage.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>;

export default InventoryManagementPage;
