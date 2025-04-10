import { ReactNode } from 'react';

import Header from '@/modules/header';
import Sidebar from '@/modules/sidebar/Sidebar';
import { useMobileNavigation } from '@/shared/hooks/useMobileNavigation';
import NavigationLoadingWrapper from '@/shared/navigation-loading-wrapper';

type MainLayoutProps = {
  children?: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const { isMobileNavOpen, onCloseMobileNav, onOpenMobileNav } = useMobileNavigation();

  return (
    <section className='layout'>
      <Sidebar isMobileNavOpen={isMobileNavOpen} onCloseMobileNav={onCloseMobileNav} />
      <div className='section-wrapper'>
        <Header onBurgerIconClick={onOpenMobileNav} />
        <NavigationLoadingWrapper>
          <main>{children}</main>
        </NavigationLoadingWrapper>
      </div>
    </section>
  );
};

export default MainLayout;
