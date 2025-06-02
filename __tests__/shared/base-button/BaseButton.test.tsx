import BaseButton from '@/shared/base-button';
import { BaseButtonProps } from '@/shared/base-button/BaseButton';
import { render, screen } from '@testing-library/react';

describe('BaseButton', () => {
  const defaultProps = {
    isLoading: false,
    isDisabled: false,
    label: 'Test Button',
    className: '',
    icon: undefined,
    onClick: jest.fn(),
  };

  const BaseButtonComponent = (props?: Partial<BaseButtonProps>) => <BaseButton {...defaultProps} {...props} />;

  it('should render component without crashing', () => {
    render(BaseButtonComponent());

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should render loader when isLoading is true', () => {
    render(BaseButtonComponent({ isLoading: true }));

    expect(screen.getByTestId('button-loader')).toBeInTheDocument();
  });

  it('should render icon if it is defined via props', () => {
    render(BaseButtonComponent({ icon: <p>Test Icon</p> }));

    expect(screen.getByText('Test Icon')).toBeInTheDocument();
  });

  it('should disable button if isDisabled is true', () => {
    render(BaseButtonComponent({ isDisabled: true }));

    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
  });
});
