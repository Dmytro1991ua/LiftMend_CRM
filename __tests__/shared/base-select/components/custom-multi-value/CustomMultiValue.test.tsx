import { render, screen } from '@testing-library/react';
import { components as defaultComponents } from 'react-select';

import CustomMultiValue from '@/shared/base-select/components/custom-multi-value';
import { CustomMultiValueProps } from '@/shared/base-select/types';

jest.mock('react-select', () => {
  const originalModule = jest.requireActual('react-select');

  return {
    ...originalModule,
    components: {
      ...originalModule.components,
      MultiValue: ({ children }: Partial<CustomMultiValueProps<string, true>>) => (
        <div data-testid='multi-value'>{children}</div>
      ),
      MultiValueLabel: ({ children }: Partial<CustomMultiValueProps<string, true>>) => (
        <div data-testid='multi-value-label'>{children}</div>
      ),
      MultiValueContainer: ({ children }: any) => <div data-testid='multi-value-container'>{children}</div>,
    },
  };
});

describe('CustomMultiValue', () => {
  const mockOptions = [
    { label: 'Option 1', value: 'Option 1', id: '1' },
    { label: 'Option 2', value: 'Option 2', id: '2' },
    { label: 'Option 3', value: 'Option 3', id: '3' },
    { label: 'Option 4', value: 'Option 4', id: '4' },
    { label: 'Option 5', value: 'Option 5', id: '5' },
    { label: 'Option 6', value: 'Option 6', id: '6' },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    options: mockOptions,
    index: 0,
    data: {},
    isDisabled: false,
    isFocused: false,
    isSelected: false,
    children: <div data-testid='multi-value-label'>Default</div>,
    selectProps: {
      innerProps: {},
      maxVisibleOptionsCount: 10,
      components: {
        ...defaultComponents,
      },
    },
    getValue: jest.fn(),
    hasValue: false,
    innerRef: jest.fn(),
    getStyles: jest.fn(),
    getClassNames: jest.fn(),
    cx: jest.fn(),
  } as unknown as CustomMultiValueProps<string, true>;

  const CustomMultiValueComponent = (props?: Partial<CustomMultiValueProps<string, true>>) => (
    <CustomMultiValue {...defaultProps} {...props} />
  );

  it('should render MultiValue when index is within maxVisibleOptionsCount', () => {
    render(
      CustomMultiValueComponent({
        data: mockOptions[0],
        index: 2,
        children: <div>Option 3</div>,
        getValue: () => mockOptions,
      })
    );

    expect(screen.getByTestId('multi-value')).toBeInTheDocument();
    expect(screen.getByTestId('multi-value-label')).toHaveTextContent('Option 3');
  });

  it('should not render when value is beyond maxVisibleOptionsCount', () => {
    render(
      CustomMultiValueComponent({
        data: mockOptions[5],
      })
    );

    expect(screen.queryByTestId('multi-value')).not.toBeInTheDocument();
    expect(screen.queryByTestId('multi-value-label')).not.toBeInTheDocument();
  });

  it('should render "+X more" when current item is the last max-displayed one and remaining values exist', () => {
    render(
      CustomMultiValueComponent({
        data: mockOptions[4], // index 4 == 5 - 1
        getValue: () => mockOptions.slice(0, 6), // 6 total values
        children: <div data-testid='multi-value-label'>Option 5</div>,
        selectProps: { ...defaultProps.selectProps, maxVisibleOptionsCount: 5 },
      })
    );

    expect(screen.getByTestId('multi-value')).toBeInTheDocument();
    expect(screen.getByText('+1 more')).toBeInTheDocument();
  });

  it('renders nothing when getValue does not return an array', () => {
    render(
      CustomMultiValueComponent({
        // @ts-expect-error
        getValue: () => ({}),
      })
    );

    expect(screen.queryByTestId('multi-value')).not.toBeInTheDocument();
    expect(screen.queryByTestId('multi-value-label')).not.toBeInTheDocument();
  });

  it('should not render MultiValue when index is equal to or greater than maxVisibleOptionsCount', () => {
    const mockDropdownOptions = [
      ...mockOptions,
      { label: 'Option 7', value: 'Option 7', id: '7' },
      { label: 'Option 8', value: 'Option 8', id: '8' },
      { label: 'Option 9', value: 'Option 9', id: '9' },
      { label: 'Option 10', value: 'Option 10', id: '10' },
      { label: 'Option 11', value: 'Option 11', id: '11' },
    ];

    render(
      CustomMultiValueComponent({
        data: mockDropdownOptions[10],
        getValue: () => mockDropdownOptions,
        index: 10,
      })
    );

    expect(screen.queryByTestId('multi-value')).not.toBeInTheDocument();
    expect(screen.queryByTestId('multi-value-label')).not.toBeInTheDocument();
  });
});
