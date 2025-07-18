import { InMemoryCache } from '@apollo/client';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { FieldValues, FormProvider, UseFormProps, useForm } from 'react-hook-form';

import { AppRoutes } from '@/types/enums';

import createMockRouter from './createMockRouter';

interface CombinedWrapperProps<T extends FieldValues> {
  component: JSX.Element;
  path: AppRoutes;
  mocks?: MockedResponse[];
  formOptions?: UseFormProps<T>;
}

export const withRouterProvider = (component: JSX.Element, path: AppRoutes) => {
  return <RouterContext.Provider value={createMockRouter({ pathname: path })}>{component}</RouterContext.Provider>;
};

export const withApolloProvider = (component: JSX.Element, mocks: MockedResponse[] = [], cache?: InMemoryCache) => {
  const defaultCache = new InMemoryCache({
    addTypename: false,
  });

  return (
    <MockedProvider addTypename={false} cache={cache ?? defaultCache} mocks={mocks}>
      {component}
    </MockedProvider>
  );
};

export const withRouterAndApolloProvider = (component: JSX.Element, path: AppRoutes, mocks: MockedResponse[] = []) => {
  return (
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

export const withFormProvider = <T extends FieldValues>(
  component: JSX.Element,
  formOptions?: UseFormProps<T>
): JSX.Element => {
  const Wrapper = () => {
    const methods = useForm<T>(formOptions);
    return <FormProvider {...methods}>{component}</FormProvider>;
  };

  return <Wrapper />;
};

export const withApolloAndFormProvider = <T extends FieldValues>(
  component: JSX.Element,
  mocks: MockedResponse[] = [],
  formOptions?: UseFormProps<T>
) => {
  const Wrapper = () => {
    const methods = useForm<T>(formOptions);

    return (
      <MockedProvider addTypename={false} mocks={mocks}>
        <FormProvider {...methods}>{component}</FormProvider>
      </MockedProvider>
    );
  };

  return <Wrapper />;
};

export const withAllProviders = <T extends FieldValues>({
  component,
  path,
  mocks = [],
  formOptions,
}: CombinedWrapperProps<T>): JSX.Element => {
  const Wrapper = () => {
    const methods = useForm<T>(formOptions);

    return (
      <RouterContext.Provider value={createMockRouter({ pathname: path })}>
        <MockedProvider addTypename={false} mocks={mocks}>
          <FormProvider {...methods}>{component}</FormProvider>
        </MockedProvider>
      </RouterContext.Provider>
    );
  };

  return <Wrapper />;
};
