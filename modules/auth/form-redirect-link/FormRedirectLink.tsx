import React, { memo } from 'react';

import Link from 'next/link';

type FormRedirectLinkProps = {
  route: string;
  title: string;
};

const FormRedirectLink = ({ route, title }: FormRedirectLinkProps) => {
  console.log(route, title);
  return (
    <Link href={route}>
      <a className='text-sm text-primary hover:text-blue-800 text-center underline cursor-pointer'>{title}</a>
    </Link>
  );
};

export default memo(FormRedirectLink);
