import MainLayout from '@/modules/layout/MainLayout';
import TechnicianRecordDetails from '@/modules/technician-management/components/technician-record-details';
import { NextPageWithLayout } from '@/shared/types';

const TechnicianRecordDetailsPage: NextPageWithLayout = () => {
  return <TechnicianRecordDetails />;
};

TechnicianRecordDetailsPage.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>;

export default TechnicianRecordDetailsPage;
