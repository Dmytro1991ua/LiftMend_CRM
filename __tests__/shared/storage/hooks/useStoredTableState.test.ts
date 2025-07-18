import { act, renderHook } from '@testing-library/react-hooks';

import { DASHBOARD_STATE_STORAGE_KEY } from '@/shared/constants';
import useStoredTableState from '@/shared/storage/hooks';
import { TableStorageState } from '@/shared/storage/hooks/useStoredState';
import { StorageTableName } from '@/shared/types';

type TestInitialState = TableStorageState<undefined, undefined, undefined>;

describe('useStoredTableState', () => {
  const mockSessionStorage: Record<string, string> = {};

  beforeEach(() => {
    Object.keys(mockSessionStorage).forEach((key) => delete mockSessionStorage[key]);

    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string): string | null => {
      return mockSessionStorage[key] ?? null;
    });

    jest.spyOn(Storage.prototype, 'setItem').mockImplementation((key: string, value: string): void => {
      mockSessionStorage[key] = value;
    });

    jest.spyOn(Storage.prototype, 'removeItem').mockImplementation((key: string): void => {
      delete mockSessionStorage[key];
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const hook = (initialState?: TestInitialState) =>
    renderHook(() => useStoredTableState(DASHBOARD_STATE_STORAGE_KEY, StorageTableName.DashboardPage, initialState));

  it('should initialize with initial state if sessionStorage has no data', () => {
    const mockInitialState = {
      sorting: { field: 'default', order: 'desc' },
    } as unknown as TestInitialState;

    const { result } = hook(mockInitialState);

    expect(result.current.storedState).toEqual(mockInitialState);
  });

  it('should restore state from sessionStorage if exists', () => {
    const mockStoredValue = {
      filters: { status: ['scheduled'] },
    } as unknown as TestInitialState;

    const mockStoragePayload = JSON.stringify({ [StorageTableName.DashboardPage]: mockStoredValue });

    mockSessionStorage[DASHBOARD_STATE_STORAGE_KEY] = mockStoragePayload;

    const { result } = hook();

    expect(result.current.storedState).toEqual(mockStoredValue);
  });

  it('should update sessionStorage when state changes', () => {
    const { result } = hook();

    const mockNewStorageState = { dateFilter: { from: '2023-01-01', to: '2023-01-31' } } as unknown as TestInitialState;

    act(() => {
      result.current.setStoredState(mockNewStorageState);
    });

    const mockSavedValue = JSON.parse(mockSessionStorage[DASHBOARD_STATE_STORAGE_KEY]);

    expect(mockSavedValue[StorageTableName.DashboardPage]).toEqual(mockNewStorageState);
  });
});
