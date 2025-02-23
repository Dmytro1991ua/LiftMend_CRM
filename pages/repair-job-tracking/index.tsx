import RepairJobTracking from '@/modules/repair-job-tracking';
import { NextPageWithLayout } from '@/shared/types';
import MainLayout from '@/modules/layout/MainLayout';

const RepairJobTrackingPage: NextPageWithLayout = () => {
  return <RepairJobTracking />;
};

RepairJobTrackingPage.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>;

export default RepairJobTrackingPage;
