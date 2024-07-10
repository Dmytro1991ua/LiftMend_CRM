import { render } from '@testing-library/react';
import { RouterContext } from 'next/dist/shared/lib/router-context';

import { AppRoutes } from '@/types/enums';

import createMockRouter from './createMockRouter';

export const withRouterProvider = (component: JSX.Element, path: AppRoutes) => {
  return render(
    <RouterContext.Provider value={createMockRouter({ pathname: path })}>{component}</RouterContext.Provider>
  );
};
