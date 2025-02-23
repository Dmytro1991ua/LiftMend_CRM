import ElevatorRecordDetails from '@/modules/elevator-management/components/elevator-record-details/ElevatorRecordDetails';
import MainLayout from '@/modules/layout/MainLayout';
import { NextPageWithLayout } from '@/shared/types';

const ElevatorRecordDetailsPage: NextPageWithLayout = () => {
  return <ElevatorRecordDetails />;
};

ElevatorRecordDetailsPage.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>;

export default ElevatorRecordDetailsPage;
