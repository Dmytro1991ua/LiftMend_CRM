import { ApolloError, FieldPolicy } from '@apollo/client';
import { SafeReadonly } from '@apollo/client/cache/core/types/common';
import Cookies from 'js-cookie';

import { ClientErrors, GQLErrorDetail, KeyArgs } from './types';

import type { GraphQLError } from 'graphql';

/**
 * Create a mapping of status to error message
 * @param errors GraphQLErrors[] List of graphQL Errors
 */
export const createGraphQLErrorMap = (errors: ReadonlyArray<GraphQLError>): ClientErrors => {
  const errorMap: ClientErrors = {};

  // loop through all graphql errors
  errors.forEach((gqlErr) => {
    const response: any = gqlErr.extensions?.response || {};

    if (Array.isArray(response?.body)) {
      errorMap[response?.status] = response?.body;
    } else {
      const errorPropertyNames: string[] | undefined =
        response?.body?.error && Object.getOwnPropertyNames(response?.body?.error);
      const bodyPropertyNames: string[] | undefined = response?.body && Object.getOwnPropertyNames(response?.body);

      const status = response?.status;

      let details: GQLErrorDetail[] | undefined = undefined;
      let message: string | undefined = undefined;
      let name: string | undefined = undefined;

      // we need to make sure there is something in there so we can get the response
      if (errorPropertyNames?.includes('details') && errorPropertyNames?.includes('message')) {
        details = response.body.error.details;
        message = response.body.error.message;
      } else if (bodyPropertyNames?.includes('message') && bodyPropertyNames.includes('name')) {
        message = response.body.message;
        name = response.body.name;
      }

      // Initialize status array if necessary
      if ((details || message || name) && !errorMap[status]) errorMap[status] = [];

      // for each detail issue we want to capture that for showing errors from service
      details?.forEach((detail: GQLErrorDetail) => errorMap[status].push(detail.issue));

      if (message?.length) errorMap[status].push(message);
      if (name?.length) errorMap[status].push(name);
    }
  });

  return errorMap;
};

export const getErrorMessageFromGraphQlErrors = (errors: ReadonlyArray<GraphQLError>): string => {
  const errorMap = createGraphQLErrorMap(errors);
  const isErrorMapEmpty = !Object.values(errorMap).length;
  const errorMsgList = isErrorMapEmpty ? errors?.map(({ message }) => message) : Object.values(errorMap).flat();

  const errorMsg = errorMsgList
    .map<string>((errorValue) => {
      if (typeof errorValue === 'string') return errorValue;

      const { error } = errorValue;

      const errorMessage = error.details
        ? error.details.reduce((acc, detail) => {
            return acc + detail.issue;
          }, '')
        : error.message;

      return errorMessage;
    })
    .join('\r\n');

  return errorMsg;
};

/**
/**
 * This function is used to handle errors in a readable state to help make error
 * handling more generic so that the app can extract error messages from the server easier.
 * @param error ApolloError The error that came back from an Apollo Client call.
 */
export const handleGraphQLErrors = (error: ApolloError): ClientErrors => createGraphQLErrorMap(error.graphQLErrors);

export const findValueInArray = (keyToBeFind: string, array: string[] | undefined): string | undefined => {
  if (!array || array.length === 0) return undefined;

  const regex = new RegExp(keyToBeFind);

  return array.find((value) => regex.test(value));
};

export const getGraphQLErrorExtensionsMessage = (error: ApolloError): string | undefined => {
  let result: string | undefined = undefined;

  if (!error.graphQLErrors) return;

  error.graphQLErrors.forEach((gqlError) => {
    const extensions =
      (gqlError.extensions as {
        response?: {
          body?: {
            error?: {
              message?: string;
            };
          };
        };
      }) || {};

    const message = extensions.response?.body?.error?.message;
    if (message) {
      result = message;
    }
  });

  return result;
};

export const concatPaginationWithEdges = <T extends { edges: unknown[] }>(
  keyArgs: KeyArgs = false
): FieldPolicy<T> => ({
  keyArgs,
  merge(existing, incoming, { args }): SafeReadonly<T> & { edges: unknown[] } {
    const offset = args?.paginationOptions?.offset || 0;
    const mergedEdges = existing && offset ? existing.edges.slice(0) : [];

    for (let i = 0; i < incoming.edges.length; ++i) {
      mergedEdges[offset + i] = incoming.edges[i];
    }

    return {
      ...incoming,
      edges: mergedEdges,
    };
  },
});

export const getSupabaseToken = (): string | undefined => {
  const rawToken = Cookies.get('sb-qgaqvfqcyjcewjnntzci-auth-token');

  if (!rawToken) return;

  try {
    // Parse the cookie value as JSON.
    // Supabase stores the token as a JSON-encoded array (e.g., ["access_token", ...])
    const tokenArray = JSON.parse(rawToken);

    return Array.isArray(tokenArray) && tokenArray.length > 0 ? tokenArray[0] : rawToken;
  } catch (error) {
    return rawToken;
  }
};
