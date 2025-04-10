import { InMemoryCache } from '@apollo/client';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { RouterContext } from 'next/dist/shared/lib/router-context';

import { AppRoutes } from '@/types/enums';

import createMockRouter from './createMockRouter';

export const withRouterProvider = (component: JSX.Element, path: AppRoutes) => {
  return render(
    <RouterContext.Provider value={createMockRouter({ pathname: path })}>{component}</RouterContext.Provider>
  );
};

export const withRouterAndApolloProvider = (component: JSX.Element, path: AppRoutes, mocks: MockedResponse[] = []) => {
  return render(
    <RouterContext.Provider value={createMockRouter({ pathname: path })}>
      <MockedProvider addTypename={false} mocks={mocks}>
        {component}
      </MockedProvider>
    </RouterContext.Provider>
  );
};

const defaultCache = new InMemoryCache({
  addTypename: false,
});

export const MockProviderHook: React.FC<{ mocks: MockedResponse[]; cache?: InMemoryCache }> = ({
  mocks,
  children,
  cache = defaultCache,
}) => {
  return (
    <MockedProvider addTypename={false} cache={cache} mocks={mocks}>
      {children}
    </MockedProvider>
  );
};
