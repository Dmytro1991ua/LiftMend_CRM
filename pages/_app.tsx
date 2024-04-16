import 'tailwindcss/tailwind.css';
import '@/styles/globals.css';

import { ApolloProvider } from '@apollo/client';
import { AppProps } from 'next/app';

import { Toaster } from '@/components/ui/toaster';
import { client } from '@/graphql';
import MainLayout from '@/modules/layout/MainLayout';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ApolloProvider client={client}>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
      <Toaster />
    </ApolloProvider>
  );
};

export default App;
