import { render, screen } from '@testing-library/react';

import BaseInventoryPartItem, {
  BaseInventoryPartItemProps,
} from '@/shared/repair-job/base-inventory-part-item/BaseInventoryPartItem';

describe('BaseInventoryPartItem', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps: BaseInventoryPartItemProps = {
    renderSelect: <div data-testid='render-select'>Select</div>,
    renderInput: <div data-testid='render-input'>Input</div>,
    renderRemove: <div data-testid='render-remove'>Remove</div>,
  };

  const BaseInventoryPartItemComponent = (props?: Partial<BaseInventoryPartItemProps>) =>
    render(<BaseInventoryPartItem {...defaultProps} {...props} />);

  it('should render all slots', () => {
    BaseInventoryPartItemComponent();

    expect(screen.getByTestId('render-select')).toBeInTheDocument();
    expect(screen.getByTestId('render-input')).toBeInTheDocument();
    expect(screen.getByTestId('render-remove')).toBeInTheDocument();
  });

  it('should apply error styles when hasError is true', () => {
    BaseInventoryPartItemComponent({ hasError: true });

    expect(screen.getByTestId('base-inventory-part-item')).toHaveClass('border-destructive', 'bg-destructive/5');
  });

  it('should not apply error styles when hasError is false', () => {
    BaseInventoryPartItemComponent({ hasError: false });

    expect(screen.getByTestId('base-inventory-part-item')).not.toHaveClass('border-destructive', 'bg-destructive/5');
  });

  it('should apply custom wrapperClassName', () => {
    BaseInventoryPartItemComponent({ wrapperClassName: 'custom-class' });

    expect(screen.getByTestId('base-inventory-part-item')).toHaveClass('custom-class');
  });
});
