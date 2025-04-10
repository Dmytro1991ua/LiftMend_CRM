import { ApolloClient, ApolloQueryResult, FetchResult, HttpLink, InMemoryCache, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';

import { typePolicies } from '@/graphql/typePolicies';

import { getSupabaseToken, handleGraphQLErrors } from './utils';

const uri = process.env.NEXT_PUBLIC_GRAPHQL_API_URL;

const httpLink = new HttpLink({ uri });

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach((error) => {
      console.error(`[GraphQL error]: ${JSON.stringify(error)}`);
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}, ${uri}`);
  }
});

// Auth link that reads the token from localStorage on every request.
const authLink = setContext((_, { headers }) => {
  const token = getSupabaseToken();

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
      'apollo-require-preflight': 'true',
    },
  };
});

const uploadLink = createUploadLink({
  uri,
  credentials: 'include',
  headers: { 'apollo-require-preflight': 'true' },
});

const cache = new InMemoryCache({
  typePolicies,
});

const links = [errorLink, authLink, uploadLink, httpLink];

export const client = new ApolloClient({
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
