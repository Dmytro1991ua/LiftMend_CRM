import MainLayout from '@/modules/layout/MainLayout';
import RepairJobScheduling from '@/modules/repair-job-scheduling';
import { NextPageWithLayout } from '@/shared/types';

const RepairJobSchedulingPage: NextPageWithLayout = () => {
  return <RepairJobScheduling />;
};

RepairJobSchedulingPage.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>;

export default RepairJobSchedulingPage;
