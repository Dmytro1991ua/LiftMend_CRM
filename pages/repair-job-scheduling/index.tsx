import RepairJobScheduling from '@/modules/repair-job-scheduling';
import { NextPageWithLayout } from '@/shared/types';
import MainLayout from '@/modules/layout/MainLayout';

const RepairJobSchedulingPage: NextPageWithLayout = () => {
  return <RepairJobScheduling />;
};

RepairJobSchedulingPage.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>;

export default RepairJobSchedulingPage;
