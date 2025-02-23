import React from 'react';

import Dashboard from '@/modules/dashboard';
import MainLayout from '@/modules/layout/MainLayout';
import { NextPageWithLayout } from '@/shared/types';

const DashboardPage: NextPageWithLayout = () => {
  return <Dashboard />;
};

DashboardPage.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>;

export default DashboardPage;
