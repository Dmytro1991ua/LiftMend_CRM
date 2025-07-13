import React from 'react';

import { render, screen } from '@testing-library/react';
import { GroupBase, MultiValueProps, components } from 'react-select';

import CustomValueContainer from '@/shared/base-select/components/custom-value-container';
import {
  CustomMultiValueProps,
  CustomPlaceholderProps,
  CustomSingleValueProps,
  CustomValueContainerProps,
} from '@/shared/base-select/types';

jest.mock('@/shared/base-select/components/custom-multi-value', () => ({
  __esModule: true,
  default: (props: CustomMultiValueProps<string, true>) => (
    <div data-testid='custom-multi-value'>Multi: {props.data?.label}</div>
  ),
}));
jest.mock('@/shared/base-select/components/custom-placeholder', () => ({
  __esModule: true,
  default: (props: CustomPlaceholderProps<string, false>) => (
    <div data-testid='custom-placeholder'>Placeholder: {props.children}</div>
  ),
}));
jest.mock('@/shared/base-select/components/custom-single-value', () => ({
  __esModule: true,
  default: (props: CustomSingleValueProps<string, false>) => (
    <div data-testid='custom-single-value'>Single: {props.children}</div>
  ),
}));

describe('CustomValueContainer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    cx: jest.fn(),
    clearValue: jest.fn(),
    getStyles: jest.fn(),
    getValue: jest.fn(),
    isMulti: false,
    isRtl: false,
    options: [],
    selectOption: jest.fn(),
    setValue: jest.fn(),
    selectProps: {
      placeholder: 'Select an option',
      isDisabled: false,
      isFocused: false,
      getOptionLabel: jest.fn((option) => option.label),
    },
    theme: {},
    getClassNames: jest.fn(),
    innerProps: {},
  } as unknown as CustomValueContainerProps<string, true>;

  const CustomValueContainerComponent = (props?: Partial<CustomValueContainerProps<string, true>>) => (
    <CustomValueContainer {...defaultProps} {...props} />
  );

  it('should render CustomMultiValue when child type matches components.MultiValue', () => {
    const multiValueChild = React.createElement(components.MultiValue, {
      data: { label: 'Option 1', value: 'Option 1', id: '1' },
      innerProps: {},
    } as MultiValueProps<unknown, boolean, GroupBase<unknown>>);

    render(CustomValueContainerComponent({ children: multiValueChild }));

    expect(screen.getByTestId('custom-multi-value')).toBeInTheDocument();
  });

  it('should render CustomSingleValue when hasValue is true and child is not valid React element', () => {
    render(
      CustomValueContainerComponent({
        hasValue: true,
        getValue: () => [{ label: 'Option 1', value: 'Option 1', id: '1' }],
        children: 'not-an-element',
      })
    );

    expect(screen.getByTestId('custom-single-value')).toBeInTheDocument();
  });

  it('should render CustomPlaceholder when hasValue is false and child is not valid React element', () => {
    render(
      CustomValueContainerComponent({
        hasValue: false,
        children: 'not-an-element',
      })
    );

    expect(screen.getByTestId('custom-placeholder')).toBeInTheDocument();
  });

  it('should render unmodified child if it is a valid React element but not MultiValue', () => {
    render(
      CustomValueContainerComponent({
        children: <div data-testid='other-element'>Other</div>,
      })
    );

    expect(screen.getByTestId('other-element')).toBeInTheDocument();
  });
});
