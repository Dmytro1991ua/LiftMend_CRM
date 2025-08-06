import { ResolversObject } from '@/graphql/types/server/generated_types';

import createDataSourcesMock from './mockedDataSources';

import type { GraphQLResolveInfo } from 'graphql/type';

const getMockContext = (dataSources: ReturnType<typeof createDataSourcesMock>) => {
  return {
    dataSources,
    dataLoaders: new WeakMap(),
    environment: 'test',
  };
};
function makeDefaultMockInfo(fieldName: string | symbol | number): GraphQLResolveInfo {
  // using "as" because we may not need more info than just the field name
  return { fieldName } as GraphQLResolveInfo;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TestedFn<T extends ResolversObject<Record<string, unknown>>, U extends string> = Extract<T[U], () => any>;

export type TestResolver<T extends ResolversObject<Record<string, unknown>>, U extends string> = (
  parent?: Record<string, unknown>,
  args?: Record<string, unknown>,
  info?: Partial<GraphQLResolveInfo>
) => ReturnType<TestedFn<T, U>>;

/**
 * getResolverToTest is a utility function for "getting" a resolver object's resolver/field, and returning
 * a callback function that accepts partial or incomplete arguments for the standard resolver function signature.
 *
 * It also automatically injects our mocked dataSources object.
 *
 * @example
 * const resolver = getResolverToTest<ResolversObjType, 'objTypeKey'>(ResolversObj, 'objKey');
 *
 * // no errors for not providing `parent`, `args`, or `info` arguments
 * resolver();
 */
function getResolverToTest<T extends ResolversObject<Record<string, unknown>>, U extends string>(
  resolversObj: T,
  fieldName: keyof T,
  dataSources: ReturnType<typeof createDataSourcesMock>
): TestResolver<T, U> {
  const mockInfo: GraphQLResolveInfo = makeDefaultMockInfo(fieldName);
  const testResolver: TestedFn<T, U> = resolversObj[fieldName];
  const mockContext = getMockContext(dataSources);

  return (parent = {}, args = {}, info = {}): ReturnType<TestedFn<T, U>> => {
    return testResolver(parent, args, mockContext, { ...mockInfo, ...info });
  };
}

export default getResolverToTest;
