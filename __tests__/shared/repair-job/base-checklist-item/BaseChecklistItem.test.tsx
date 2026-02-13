import { render, screen } from '@testing-library/react';

import BaseChecklistItem, { BaseChecklistItemProps } from '@/shared/repair-job/base-checklist-item/BaseChecklistItem';

jest.mock('@/shared/utils', () => ({
  ...jest.requireActual('@/shared/utils'),
  getCommonFormLabelErrorStyles: jest.fn((hasError: boolean) => (hasError ? 'error-label' : '')),
}));

describe('BaseChecklistItem', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    label: 'Check motor',
    hasError: false,
    wrapperClassName: 'custom-wrapper',
    renderCheckbox: <input data-testid='checkbox' type='checkbox' />,
    renderInput: <input data-testid='input' />,
  };

  const BaseChecklistItemComponent = (props?: Partial<BaseChecklistItemProps>) => (
    <BaseChecklistItem {...defaultProps} {...props} />
  );

  it('should render label, checkbox, and input', () => {
    render(BaseChecklistItemComponent());

    expect(screen.getByText('Check motor')).toBeInTheDocument();
    expect(screen.getByTestId('checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('input')).toBeInTheDocument();
  });

  it('should apply error label styles when hasError is true', () => {
    render(BaseChecklistItemComponent({ hasError: true }));

    const label = screen.getByText('Check motor');

    expect(label).toHaveClass('error-label');
  });

  it('should not apply error label styles when hasError is false', () => {
    render(BaseChecklistItemComponent());

    const label = screen.getByText('Check motor');

    expect(label).not.toHaveClass('error-label');
  });

  it('should render custom checkbox and input nodes', () => {
    render(BaseChecklistItemComponent());

    const checkbox = screen.getByTestId('checkbox') as HTMLInputElement;
    const input = screen.getByTestId('input') as HTMLInputElement;

    expect(checkbox).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });
});
