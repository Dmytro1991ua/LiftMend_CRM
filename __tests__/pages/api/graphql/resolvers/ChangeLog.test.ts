import { ChangeLogResolvers } from '@/graphql/types/server/generated_types';
import getResolverToTest, { TestResolver } from '@/mocks/gql/getResolverToTest';
import createDataSourcesMock from '@/mocks/gql/mockedDataSources';
import { changeLogPrismaMock } from '@/mocks/gql/prismaMocks';
import ChangeLog from '@/pages/api/graphql/resolvers/ChangeLog';
import { computeChangeLogFieldChanges } from '@/pages/api/graphql/resolvers/utils';

jest.mock('@/pages/api/graphql/resolvers/utils', () => ({
  computeChangeLogFieldChanges: jest.fn(),
}));

describe('ChangeLog', () => {
  let mockDataSources: ReturnType<typeof createDataSourcesMock>;

  let changeListResolver: TestResolver<ChangeLogResolvers, 'changeList'>;
  let modifiedByResolver: TestResolver<ChangeLogResolvers, 'modifiedBy'>;

  beforeEach(() => {
    mockDataSources = createDataSourcesMock(changeLogPrismaMock);

    changeListResolver = getResolverToTest<ChangeLogResolvers, 'changeList'>(ChangeLog, 'changeList', mockDataSources);
    modifiedByResolver = getResolverToTest<ChangeLogResolvers, 'modifiedBy'>(ChangeLog, 'modifiedBy', mockDataSources);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('modifiedBy', () => {
    it('should return "System" if userId is null', async () => {
      const result = await modifiedByResolver({ userId: null });

      expect(result).toBe('System');
    });

    it('should fetch user and return name if firstName and lastName exist', async () => {
      const mockUser = { id: 'test-id', firstName: 'John', lastName: 'Doe', email: 'john@example.com' };
      mockDataSources.user.user.mockResolvedValue(mockUser);

      const result = await modifiedByResolver({ userId: '123' });

      expect(mockDataSources.user.user).toHaveBeenCalledWith('123');
      expect(result).toBe('John Doe');
    });

    it('should return email if firstName or lastName missing', async () => {
      const mockUser = { id: 'test-id', firstName: '', lastName: '', email: 'no-name@example.com' };
      mockDataSources.user.user.mockResolvedValue(mockUser);

      const result = await modifiedByResolver({ userId: '456' });

      expect(result).toBe('no-name@example.com');
    });
  });

  describe('changeList', () => {
    it('should return computed change log changes', async () => {
      const mockChangeList = [{ field: 'name', oldValue: 'Old', newValue: 'New', action: 'update' }];

      (computeChangeLogFieldChanges as jest.Mock).mockReturnValue(mockChangeList);

      const args = { oldValue: '{"name":"Old"}', newValue: '{"name":"New"}', action: 'update' };

      const result = await changeListResolver(args);

      expect(computeChangeLogFieldChanges).toHaveBeenCalledWith(args);
      expect(result).toEqual(mockChangeList);
    });

    it('should return empty array if no changes', async () => {
      (computeChangeLogFieldChanges as jest.Mock).mockReturnValue([]);

      const args = { oldValue: null, newValue: null, action: 'update' };

      const result = await changeListResolver(args);

      expect(result).toEqual([]);
    });
  });
});
