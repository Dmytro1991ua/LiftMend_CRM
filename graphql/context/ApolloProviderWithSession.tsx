import { useEffect, useState } from 'react';

import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Session } from '@supabase/supabase-js';

import { typePolicies } from '@/graphql/typePolicies';

type ApolloProviderWithSessionProps = {
  children: React.ReactNode;
};

const createAuthLink = (session?: Session | null) => {
  return setContext(async (_, { headers }) => {
    return {
      headers: {
        ...headers,
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
    };
  });
};

const createApolloClient = (session?: Session | null) => {
  const uri = process.env.NEXT_PUBLIC_GRAPHQL_API_URL;

  const httpLink = new HttpLink({ uri });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach((error): void => {
        console.error(`[GraphQL error]: ${JSON.stringify(error)}`);
      });
    }

    if (networkError) {
      console.error(`[Network error]: ${networkError}, ${uri}`);
    }
  });

  const authLink = createAuthLink(session);

  const links = [errorLink, authLink, httpLink];

  const cache = new InMemoryCache({
    typePolicies,
  });

  const client = new ApolloClient({
    link: from(links),
    credentials: 'same-origin',
    cache,
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
      },
      query: { fetchPolicy: 'cache-first', errorPolicy: 'all' },
      mutate: { errorPolicy: 'all' },
    },
    queryDeduplication: false,
  });

  return client;
};

export const ApolloProviderWithSession = ({ children }: ApolloProviderWithSessionProps) => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [client, setClient] = useState(() => createApolloClient(session));

  useEffect(() => {
    setClient(createApolloClient(session));
  }, [session]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
