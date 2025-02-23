import MainLayout from '@/modules/layout/MainLayout';
import RepairJobDetails from '@/shared/repair-job/repair-job-details';
import { NextPageWithLayout } from '@/shared/types';

const RepairJobDetailsPage: NextPageWithLayout = () => {
  return <RepairJobDetails />;
};

RepairJobDetailsPage.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>;

export default RepairJobDetailsPage;
