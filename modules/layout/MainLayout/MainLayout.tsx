import { ReactNode } from 'react';

import Header from '@/modules/header';
import Sidebar from '@/modules/sidebar/Sidebar';

type MainLayoutProps = {
  children?: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <section className='layout'>
      <Sidebar />
      <div className='section-wrapper'>
        <Header />
        <main className='max-w-screen-2xl'>{children}</main>
      </div>
    </section>
  );
};

export default MainLayout;
