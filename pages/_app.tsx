import 'tailwindcss/tailwind.css';
import '@/styles/globals.css';
import '@/styles/overrides/calendar.css';

import { ApolloProvider } from '@apollo/client';
import { AppProps } from 'next/app';
import { ErrorBoundary } from 'react-error-boundary';

import { Toaster } from '@/components/ui/toaster';
import { client } from '@/graphql';
import MainLayout from '@/modules/layout/MainLayout';
import BaseErrorBoundary from '@/shared/base-error-boundary';
import { logError } from '@/shared/utils';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ApolloProvider client={client}>
      <ErrorBoundary FallbackComponent={BaseErrorBoundary} onError={logError}>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </ErrorBoundary>
      <Toaster />
    </ApolloProvider>
  );
};

export default App;
