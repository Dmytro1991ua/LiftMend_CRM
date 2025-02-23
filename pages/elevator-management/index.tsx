import ElevatorManagement from '@/modules/elevator-management';
import { NextPageWithLayout } from '@/shared/types';
import MainLayout from '@/modules/layout/MainLayout';

const ElevatorManagementPage: NextPageWithLayout = (): React.JSX.Element => {
  return <ElevatorManagement />;
};

ElevatorManagementPage.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>;

export default ElevatorManagementPage;
