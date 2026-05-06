import { render, screen } from '@testing-library/react';
import { OptionProps } from 'react-select';

import CustomOption from '@/shared/base-select/components/custom-option';
import { DropdownOption } from '@/shared/base-select/types';
import { BaseTooltipProps } from '@/shared/base-tooltip/BaseTooltip';

jest.mock('react-select', () => ({
  components: {
    Option: jest.fn(({ children }: { children: React.ReactNode }) => <div data-testid='rs-option'>{children}</div>),
  },
}));

jest.mock('@/shared/base-tooltip/BaseTooltip', () =>
  jest.fn(({ children, disable, message, id }: BaseTooltipProps) => (
    <div data-disable={String(disable)} data-id={id} data-message={message} data-testid='base-tooltip'>
      {children}
    </div>
  ))
);

describe('CustomOption', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    data: {
      id: 'option-1',
      label: 'Test Option',
      value: 'test',
    },

    isDisabled: false,
  } as unknown as OptionProps<DropdownOption<string>>;

  const CustomOptionComponent = (props?: Partial<DropdownOption>) => (
    <CustomOption {...defaultProps} data={{ ...defaultProps.data, ...props }} />
  );

  it('should render option label', () => {
    render(CustomOptionComponent());

    expect(screen.getByTestId('rs-option')).toHaveTextContent('Test Option');
  });

  it('should pass correct tooltip id', () => {
    render(CustomOptionComponent());

    expect(screen.getByTestId('base-tooltip')).toHaveAttribute('data-id', 'option-tooltip-option-1');
  });

  it('should disable tooltip when no disabledReason', () => {
    render(CustomOptionComponent());

    expect(screen.getByTestId('base-tooltip')).toHaveAttribute('data-disable', 'true');
  });

  it('should enable tooltip and show message when disabledReason is provided', () => {
    render(CustomOptionComponent({ disabledReason: 'Not available' }));

    const tooltip = screen.getByTestId('base-tooltip');

    expect(tooltip).toHaveAttribute('data-disable', 'false');
    expect(tooltip).toHaveAttribute('data-message', 'Not available');
  });

  it('should pass label as children to react-select Option', () => {
    render(CustomOptionComponent());

    expect(screen.getByText('Test Option')).toBeInTheDocument();
  });
});
