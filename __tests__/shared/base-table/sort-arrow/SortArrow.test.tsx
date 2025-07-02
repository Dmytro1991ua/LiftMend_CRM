import { render, screen } from '@testing-library/react';

import SortArrow, { SortArrowProps } from '@/shared/base-table/sort-arrow/SortArrow';

describe('SortArrow', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps: SortArrowProps = {
    isSorted: false,
  };

  const SortArrowComponent = (props?: Partial<SortArrowProps>) => <SortArrow {...defaultProps} {...props} />;

  it('should render default sorting arrow when isSorted is false', () => {
    render(SortArrowComponent());

    expect(screen.getByText('↑↓')).toBeInTheDocument();
  });

  it('should render acceding sorting arrow when isSorted is asc', () => {
    render(SortArrowComponent({ isSorted: 'asc' }));

    expect(screen.getByText('↑')).toBeInTheDocument();
  });

  it('should render descending sorting arrow when isSorted is desc', () => {
    render(SortArrowComponent({ isSorted: 'desc' }));

    expect(screen.getByText('↓')).toBeInTheDocument();
  });
});
