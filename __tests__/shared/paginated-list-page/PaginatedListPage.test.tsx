import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { getDataLoadStatusView } from '@/shared/config';
import PaginatedListPage from '@/shared/paginated-list-page';
import { PaginatedListPageProps } from '@/shared/paginated-list-page/PaginatedListPage';
import { SectionHeaderProps } from '@/shared/section-header/SectionHeader';
import { DataLoadStatus } from '@/shared/types';
import { getDerivedDataLoadStatus } from '@/shared/utils';

jest.mock('@/shared/base-button/go-back-button', () => ({
  __esModule: true,
  default: () => <button data-testid='go-back-button'>Back</button>,
}));

jest.mock('@/shared/section-header', () => ({
  __esModule: true,
  default: ({ title, goBackButton }: SectionHeaderProps) => (
    <div>
      {goBackButton}
      <h1>{title}</h1>
    </div>
  ),
}));

jest.mock('react-infinite-scroll-component', () => ({
  __esModule: true,
  default: ({ children, next }: { children: React.ReactNode; next: () => void }) => (
    <div>
      <button data-testid='load-more' onClick={next}>
        Load more
      </button>
      {children}
    </div>
  ),
}));

jest.mock('@/shared/utils', () => ({
  ...jest.requireActual('@/shared/utils'),
  getDerivedDataLoadStatus: jest.fn(),
}));

jest.mock('@/shared/config', () => ({
  ...jest.requireActual('@/shared/config'),
  getDataLoadStatusView: jest.fn(),
}));

describe('PaginatedListPage', () => {
  const mockGetDerivedDataLoadStatus = jest.mocked(getDerivedDataLoadStatus);
  const mockGetDataLoadStatusView = jest.mocked(getDataLoadStatusView);
  const mockOnNext = jest.fn();

  beforeEach(() => {
    mockGetDataLoadStatusView.mockReturnValue({
      [DataLoadStatus.Loading]: <div>Loading view</div>,
      [DataLoadStatus.Error]: <div>Error view</div>,
      [DataLoadStatus.Empty]: <div>Empty view</div>,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    sectionTitle: 'Messages History',
    isInitialLoading: false,
    isEmpty: false,
    errorMessage: undefined,
    errorTitle: 'Error',
    emptyStateMessage: 'No data',
    hasMore: false,
    totalItems: 0,
    onNext: mockOnNext,
  };

  const PaginatedListPageComponent = (props?: Partial<PaginatedListPageProps>) => (
    <PaginatedListPage {...defaultProps} {...props}>
      <div>Test Children</div>
    </PaginatedListPage>
  );

  it('should render section header', () => {
    mockGetDerivedDataLoadStatus.mockReturnValue(null);

    render(PaginatedListPageComponent());

    expect(screen.getByText('Messages History')).toBeInTheDocument();
    expect(screen.getByTestId('go-back-button')).toBeInTheDocument();
  });

  it('should render loading view', () => {
    mockGetDerivedDataLoadStatus.mockReturnValue(DataLoadStatus.Loading);

    render(PaginatedListPageComponent({ isInitialLoading: true }));

    expect(screen.getByText('Loading view')).toBeInTheDocument();
  });

  it('should render empty view', () => {
    mockGetDerivedDataLoadStatus.mockReturnValue(DataLoadStatus.Empty);

    render(PaginatedListPageComponent({ isEmpty: true }));

    expect(screen.getByText('Empty view')).toBeInTheDocument();
  });

  it('should render error view', () => {
    mockGetDerivedDataLoadStatus.mockReturnValue(DataLoadStatus.Error);

    render(PaginatedListPageComponent({ emptyStateMessage: 'Error occurred' }));

    expect(screen.getByText('Error view')).toBeInTheDocument();
  });

  it('should render children when no load status applies', () => {
    mockGetDerivedDataLoadStatus.mockReturnValue(null);

    render(PaginatedListPageComponent());

    expect(screen.getByText('Test Children')).toBeInTheDocument();
  });

  it('should call onNext when infinite scroll triggers next', async () => {
    mockGetDerivedDataLoadStatus.mockReturnValue(null);

    render(PaginatedListPageComponent({ hasMore: true }));

    await userEvent.click(screen.getByTestId('load-more'));

    expect(mockOnNext).toHaveBeenCalled();
  });
});
