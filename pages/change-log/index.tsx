import ChangeLog from '@/modules/change-log';
import MainLayout from '@/modules/layout/MainLayout';
import { NextPageWithLayout } from '@/shared/types';

const ChangeLogPage: NextPageWithLayout = () => {
  return <ChangeLog />;
};

ChangeLogPage.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>;

export default ChangeLogPage;
