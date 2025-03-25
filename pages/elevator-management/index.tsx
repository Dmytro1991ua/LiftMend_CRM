import ElevatorManagement from '@/modules/elevator-management';
import MainLayout from '@/modules/layout/MainLayout';
import { NextPageWithLayout } from '@/shared/types';

const ElevatorManagementPage: NextPageWithLayout = (): React.JSX.Element => {
  return <ElevatorManagement />;
};

ElevatorManagementPage.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>;

export default ElevatorManagementPage;
