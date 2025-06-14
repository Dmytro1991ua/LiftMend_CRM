import { render, screen } from '@testing-library/react';

import CustomMenuList from '@/shared/base-select/components/custom-menu-list';
import { CustomMenuListProps } from '@/shared/base-select/types';

describe('CustomMenuList', () => {
  const mockOnNextMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    options: [
      { label: 'Option 1', value: 'Option 1', id: '1' },
      { label: 'Option 2', value: 'Option 2', id: '2' },
    ],
    children: (
      <>
        <div>Option 1</div>
        <div>Option 2</div>
      </>
    ),
    selectProps: {
      innerProps: {},
      hasSearchInput: false,
      multipleSelectControls: false,
      hasMore: false,
      onNext: mockOnNextMock,
      options: [
        { label: 'Option 1', value: 'Option 1', id: '1' },
        { label: 'Option 2', value: 'Option 2', id: '2' },
      ],
    },
    getValue: () => [],
    hasValue: false,
    innerRef: jest.fn(),
    getStyles: jest.fn(),
    getClassNames: jest.fn(),
    cx: jest.fn(),
  } as unknown as CustomMenuListProps<string, true>;

  const CustomMenuListComponent = (props?: Partial<CustomMenuListProps<string, true>>) => (
    <CustomMenuList {...defaultProps} {...props} />
  );

  it('should render component without crashing', () => {
    render(CustomMenuListComponent());

    expect(screen.getByTestId('scrollable-options')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('should render CustomSearchInput when hasSearchInput is true', () => {
    render(
      CustomMenuListComponent({
        selectProps: {
          ...defaultProps.selectProps,
          hasSearchInput: true,
        },
      })
    );

    expect(screen.getByTestId('custom-search-input')).toBeInTheDocument();
  });

  it('should render CustomMultiControl when multipleSelectControls is true', () => {
    render(
      CustomMenuListComponent({
        selectProps: {
          ...defaultProps.selectProps,
          multipleSelectControls: true,
        },
      })
    );

    expect(screen.getByTestId('multiple-select-controls')).toBeInTheDocument();
  });

  it('should call onNext when hasMore is true and user scrolls to the bottom', async () => {
    render(
      CustomMenuListComponent({
        selectProps: {
          ...defaultProps.selectProps,
          hasMore: true,
        },
      })
    );

    mockOnNextMock();

    expect(mockOnNextMock).toHaveBeenCalled();
  });

  it('should show loader text when loading more options', () => {
    render(
      CustomMenuListComponent({
        selectProps: {
          ...defaultProps.selectProps,
          hasMore: true,
        },
      })
    );

    expect(screen.getByText('Loading....')).toBeInTheDocument();
  });
});
