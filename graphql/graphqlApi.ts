import { ApolloClient, ApolloQueryResult, FetchResult, HttpLink, InMemoryCache, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

import { typePolicies } from './typePolicies';
import { handleGraphQLErrors } from './utils';

const uri = `${process.env.NEXT_PUBLIC_GRAPHQL_API_URL}/api/graphql`;
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

const links = [errorLink, httpLink];

const cache = new InMemoryCache({
  typePolicies,
});

export const client = new ApolloClient({
  uri,
  credentials: 'same-origin',
  link: from(links),
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

const { query, mutate } = client;

// This is an apply method to be able to catch all errors when doing queries
client.query = (...args): Promise<ApolloQueryResult<any>> => {
  return query.apply(client, args).catch((error) => {
    throw new Error(JSON.stringify(handleGraphQLErrors(error)));
  });
};

// This is an apply method to be able to catch all errors when doing mutations
client.mutate = (...args: any): Promise<FetchResult<any, Record<string, any>, Record<string, any>>> => {
  return mutate.apply(client, args).catch((error) => {
    throw new Error(JSON.stringify(handleGraphQLErrors(error)));
  });
};
