import { ApolloProvider } from '@apollo/client';
import { AppProps } from 'next/app';

import { client } from '@/graphql';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
};

export default App;
