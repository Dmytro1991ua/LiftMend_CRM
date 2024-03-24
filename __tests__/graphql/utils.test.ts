import { createGraphQLErrorMap, handleGraphQLErrors } from '../../graphql/utils';
import {
  apolloDefaultError,
  bodyMessageError,
  detailsError,
  messageError,
  nullableResponse,
} from '@/mocks/errorResponse';

describe('handleGraphQLErrors', () => {
  it('should successfully create error map from array of graphql errors', () => {
    expect(createGraphQLErrorMap(messageError.graphQLErrors)).toEqual({
      420: ['Some message error here'],
    });
  });
  it('should show message error', () => {
    expect(handleGraphQLErrors(messageError)).toEqual({
      420: ['Some message error here'],
    });
  });
  it('should show details error', () => {
    expect(handleGraphQLErrors(detailsError)).toEqual({
      426: ['Some details error here'],
    });
  });
  it('should return body message if body error is unavailable', () => {
    expect(handleGraphQLErrors(bodyMessageError)).toEqual({
      409: ['Some body message here', 'INVALID_VALUE'],
    });
  });
  it("should return empty object if method doesn't exist in object", () => {
    expect(handleGraphQLErrors(nullableResponse)).toEqual({});
  });
  it('should return empty object if extensions method is empty', () => {
    expect(handleGraphQLErrors(apolloDefaultError)).toEqual({});
  });
});
