import { ApolloError } from '@apollo/client';
import { GQLErrorDetail, InventoryClientErrors } from './types';

/**
 * This function is used to handle errors in a readable state to help make error
 * handling more generic so that the app can extract error messages from the server easier.
 * @param error ApolloError The error that came back from an Apollo Client call.
 */
export const handleGraphQLErrors = (error: ApolloError): InventoryClientErrors => {
  const errorMap: InventoryClientErrors = {};

  // loop through all graphql errors
  error.graphQLErrors.forEach((gqlErr) => {
    const extensions: any = gqlErr.extensions || {};

    // we need to make sure there is something in there so we can get the response
    if (extensions && Object.keys(extensions).length && extensions?.response) {
      const responseError = extensions.response?.body?.error;
      const details = responseError?.details;
      const status = extensions.response?.status;

      if (!errorMap[status]) {
        errorMap[status] = [];
      }

      if (details?.length) {
        // for each detail issue we want to capture that for showing errors from service
        details.forEach((detail: GQLErrorDetail) => errorMap[status].push(detail.issue));
      } else {
        errorMap[status] = [responseError.message];
      }
    } else {
      errorMap[extensions?.code] = [gqlErr.message];
    }
  });

  if (error && !error.graphQLErrors.length) {
    errorMap['400'] = ['Some error occurred. Please try later'];
  }

  return errorMap;
};
