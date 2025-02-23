import MainLayout from '@/modules/layout/MainLayout';
import TechnicianManagement from '@/modules/technician-management';
import { NextPageWithLayout } from '@/shared/types';

const TechnicianManagementPage: NextPageWithLayout = () => {
  return <TechnicianManagement />;
};

TechnicianManagementPage.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>;

export default TechnicianManagementPage;
