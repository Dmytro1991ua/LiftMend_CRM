import React, { useMemo } from 'react';

import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { isRouteActive } from '@/shared/utils';
import { AppRoutes } from '@/types/enums';

interface NavigationLinkProps {
  url: AppRoutes;
  icon: React.JSX.Element;
  label: string;
  className?: string;
  onClose?: () => void;
}

const NavigationLink = ({ url, icon, label, className, onClose }: NavigationLinkProps): React.JSX.Element => {
  const router = useRouter();

  const isNavigationRouteActive = useMemo(
    () => isRouteActive({ asPath: router.asPath, pathname: router.pathname, url }),
    [router.asPath, router.pathname, url]
  );

  return (
    <Link passHref href={url}>
      <a
        className={clsx(
          'relative flex items-center justify-left z-10 p-3 mb-2 group hover:bg-background hover:text-primary transition rounded-3xl',
          [isNavigationRouteActive ? 'text-primary bg-background' : 'text-link'],
          className
        )}
        data-testid='nav-link'
        onClick={onClose}
      >
        {icon}
        <h3 className='navigation-link'>{label}</h3>
      </a>
    </Link>
  );
};

export default NavigationLink;
