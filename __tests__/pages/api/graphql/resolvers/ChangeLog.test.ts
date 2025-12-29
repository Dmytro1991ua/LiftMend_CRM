import { ChangeLogResolvers } from '@/graphql/types/server/generated_types';
import getResolverToTest, { TestResolver } from '@/mocks/gql/getResolverToTest';
import createDataSourcesMock from '@/mocks/gql/mockedDataSources';
import { changeLogPrismaMock } from '@/mocks/gql/prismaMocks';
import ChangeLog from '@/pages/api/graphql/resolvers/ChangeLog';
import { parseChangeLogValue } from '@/pages/api/graphql/resolvers/utils';

jest.mock('@/pages/api/graphql/resolvers/utils', () => ({
  parseChangeLogValue: jest.fn(),
}));

describe('ChangeLog', () => {
  let mockDataSources: ReturnType<typeof createDataSourcesMock>;

  let oldValueResolver: TestResolver<ChangeLogResolvers, 'oldValue'>;
  let newValueResolver: TestResolver<ChangeLogResolvers, 'newValue'>;

  beforeEach(() => {
    mockDataSources = createDataSourcesMock(changeLogPrismaMock);

    oldValueResolver = getResolverToTest<ChangeLogResolvers, 'oldValue'>(ChangeLog, 'oldValue', mockDataSources);
    newValueResolver = getResolverToTest<ChangeLogResolvers, 'newValue'>(ChangeLog, 'newValue', mockDataSources);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should resolve oldValue', async () => {
    (parseChangeLogValue as jest.Mock).mockReturnValue({ a: 1 });

    const result = await oldValueResolver({ oldValue: '{"a":1}' });

    expect(parseChangeLogValue).toHaveBeenCalledWith('{"a":1}');
    expect(result).toEqual({ a: 1 });
  });

  it('should resolve newValue', async () => {
    (parseChangeLogValue as jest.Mock).mockReturnValue({ b: 2 });

    const result = await newValueResolver({ newValue: '{"b":2}' });

    expect(parseChangeLogValue).toHaveBeenCalledWith('{"b":2}');
    expect(result).toEqual({ b: 2 });
  });
});
