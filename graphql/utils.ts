import { ApolloError } from '@apollo/client';

import { ClientErrors, GQLErrorDetail } from './types';

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

/**
/**
 * This function is used to handle errors in a readable state to help make error
 * handling more generic so that the app can extract error messages from the server easier.
 * @param error ApolloError The error that came back from an Apollo Client call.
 */
export const handleGraphQLErrors = (error: ApolloError): ClientErrors => createGraphQLErrorMap(error.graphQLErrors);
