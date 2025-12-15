import Notifications from '@modules/notifications';

import MainLayout from '@/modules/layout/MainLayout';
import { NextPageWithLayout } from '@/shared/types';

const NotificationsPage: NextPageWithLayout = () => {
  return <Notifications />;
};

NotificationsPage.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>;

export default NotificationsPage;
