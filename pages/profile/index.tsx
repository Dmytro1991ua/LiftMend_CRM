import MainLayout from '@/modules/layout/MainLayout';
import Profile from '@/modules/profile';
import { NextPageWithLayout } from '@/shared/types';

const ProfilePage: NextPageWithLayout = () => {
  return <Profile />;
};

ProfilePage.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>;

export default ProfilePage;
