import { ReactNode } from 'react';

import Header from '@/modules/header';
import Sidebar from '@/modules/sidebar/Sidebar';
import NavigationLoadingWrapper from '@/shared/navigation-loading-wrapper';

type MainLayoutProps = {
  children?: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <section className='layout'>
      <Sidebar />
      <div className='section-wrapper'>
        <Header />
        <NavigationLoadingWrapper>
          <main className='max-w-screen-2xl'>{children}</main>
        </NavigationLoadingWrapper>
      </div>
    </section>
  );
};

export default MainLayout;
