import 'tailwindcss/tailwind.css';
import '@/styles/globals.css';
import '@/styles/overrides/calendar.css';

import { useState } from 'react';

import { ApolloProvider } from '@apollo/client';
import { Session, createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { AppProps } from 'next/app';
import { ErrorBoundary } from 'react-error-boundary';

import { Toaster } from '@/components/ui/toaster';
import { client } from '@/graphql/apolloClient';
import BaseErrorBoundary from '@/shared/base-error-boundary';
import { UserProvider } from '@/shared/contexts/UserContext';
import { logError } from '@/shared/utils';

type NextPageWithLayout = AppProps<{
  initialSession: Session;
}> & {
  Component: AppProps['Component'] & {
    getLayout?: (page: React.ReactElement) => React.ReactNode;
  };
};

const App = ({ Component, pageProps }: NextPageWithLayout) => {
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  const getLayout = Component.getLayout || ((page) => page);

  return (
    <SessionContextProvider initialSession={pageProps.initialSession} supabaseClient={supabaseClient}>
      <ApolloProvider client={client}>
        <UserProvider>
          <ErrorBoundary FallbackComponent={BaseErrorBoundary} onError={logError}>
            {getLayout(<Component {...pageProps} />)}
          </ErrorBoundary>
          <Toaster />
        </UserProvider>
      </ApolloProvider>
    </SessionContextProvider>
  );
};

export default App;
