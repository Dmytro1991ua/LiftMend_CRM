import { render, screen } from '@testing-library/react';

import { mockSystemChangeLog, mockUserChangeLog } from '@/mocks/changeLogMocks';
import { ChangeLogContent } from '@/modules/change-log/change-log-content/ChangeLogContent';
import { ChangeLogItemProps } from '@/modules/change-log/change-log-item/ChangeLogItem';
import ChangeLog from '@/modules/change-log/ChangeLog';
import { DEFAULT_CHANGE_LOG_PAGE_DESCRIPTION, DEFAULT_CHANGE_LOG_PAGE_TITLE } from '@/modules/change-log/constants';
import { useGetChangeLogs } from '@/modules/change-log/hooks/useGetChangeLogs';
import { PaginatedListPageProps } from '@/shared/paginated-list-page/PaginatedListPage';

jest.mock('@/modules/change-log/hooks/useGetChangeLogs');

jest.mock('@/shared/paginated-list-page', () => ({
  __esModule: true,
  default: ({ children, sectionTitle, sectionSubtitle }: PaginatedListPageProps) => (
    <div>
      <h1>{sectionTitle}</h1>
      <h2>{sectionSubtitle}</h2>
      {children}
    </div>
  ),
}));

jest.mock('@/modules/change-log/change-log-item', () => ({
  __esModule: true,
  default: ({ createdAt, modifiedBy, entityType, children }: ChangeLogItemProps) => (
    <div>
      <h2>{entityType}</h2>
      <h3>{modifiedBy}</h3>
      <h2>{createdAt}</h2>
      {children}
    </div>
  ),
}));

jest.mock('@/modules/change-log/change-log-content', () => ({
  __esModule: true,
  default: ({ changeList }: ChangeLogContent) => (
    <div>
      {changeList.map((list, i) => (
        <div key={i}>
          <h2>{list.action}</h2>
          <h2>{list.oldValue}</h2>
          <h2>{list.newValue}</h2>
          <h2>{list.field}</h2>
        </div>
      ))}
    </div>
  ),
}));

describe('ChangeLog', () => {
  const mockUseGetChangeLogs = jest.mocked(useGetChangeLogs);

  beforeEach(() => {
    mockUseGetChangeLogs.mockReturnValue({
      changeLogs: [],
      isInitialLoading: false,
      isChangeLogEmpty: true,
      hasMore: false,
      totalChangeLogsLength: 0,
      error: undefined,
      onNext: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render page title and subtitle', () => {
    render(<ChangeLog />);

    expect(screen.getByText(DEFAULT_CHANGE_LOG_PAGE_TITLE)).toBeInTheDocument();
    expect(screen.getByText(DEFAULT_CHANGE_LOG_PAGE_DESCRIPTION)).toBeInTheDocument();
  });

  it('should render change logs when present', () => {
    mockUseGetChangeLogs.mockReturnValue({
      changeLogs: [mockSystemChangeLog, mockUserChangeLog],
      isInitialLoading: false,
      isChangeLogEmpty: false,
      hasMore: false,
      totalChangeLogsLength: 2,
      error: undefined,
      onNext: jest.fn(),
    });

    render(<ChangeLog />);

    expect(screen.getByText('ElevatorRecord')).toBeInTheDocument();
    expect(screen.getByText('RepairJob')).toBeInTheDocument();
    expect(screen.getByText(/System/)).toBeInTheDocument();
    expect(screen.getByText(/Alex Smith/)).toBeInTheDocument();
  });
});
