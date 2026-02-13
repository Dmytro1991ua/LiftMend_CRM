import { ChangeEvent } from 'react';

import { CheckboxProps } from '@radix-ui/react-checkbox';
import { fireEvent, render, screen } from '@testing-library/react';
import { Controller, useFormContext } from 'react-hook-form';

import ControlledChecklistItem from '@/modules/repair-job-tracking/components/complete-repair-job/controlled-checklist-Item';
import { ControlledChecklistItemProps } from '@/modules/repair-job-tracking/components/complete-repair-job/controlled-checklist-Item/ControlledChecklistItem';
import { BaseInputProps } from '@/shared/base-input/BaseInput';
import { BaseChecklistItemProps } from '@/shared/repair-job/base-checklist-item/BaseChecklistItem';

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFormContext: jest.fn(),
  Controller: jest.fn(),
}));

jest.mock('@/components/ui/checkbox', () => ({
  Checkbox: (props: CheckboxProps) => (
    <input
      checked={!!props.checked}
      data-testid='checkbox'
      disabled={props.disabled}
      type='checkbox'
      onChange={(e) => props.onCheckedChange && props.onCheckedChange(e.target.checked)}
    />
  ),
}));

jest.mock('@/shared/base-input/BaseInput', () => {
  const MockBaseInput = (props: BaseInputProps<string>) => (
    <input
      data-testid='comment-input'
      disabled={props.disabled}
      value={props.value}
      onChange={(e) => props.onChange && props.onChange(e.target.value as unknown as ChangeEvent<HTMLInputElement>)}
    />
  );
  MockBaseInput.displayName = 'MockBaseInput';
  return MockBaseInput;
});

jest.mock('@/shared/repair-job/base-checklist-item', () => {
  const MockBaseChecklistItem = (props: BaseChecklistItemProps) => (
    <div data-testid='base-item'>
      <span data-testid='label'>{props.label}</span>
      {props.hasError && <span data-testid='error'>error</span>}
      <div>{props.renderCheckbox}</div>
      <div>{props.renderInput}</div>
    </div>
  );
  MockBaseChecklistItem.displayName = 'MockBaseChecklistItem';
  return MockBaseChecklistItem;
});

describe('ControlledChecklistItem', () => {
  const mockUseFormContext = useFormContext as jest.Mock;
  const mockController = Controller as jest.Mock;

  const onChangeMock = jest.fn();

  beforeEach(() => {
    mockController.mockImplementation(({ name, render }) => {
      const field = {
        name,
        value: '',
        onChange: onChangeMock,
      };

      // eslint-disable-next-line testing-library/no-render-in-lifecycle
      return <>{render({ field })}</>;
    });

    mockUseFormContext.mockReturnValue({
      control: {},
      watch: jest.fn().mockReturnValue('Existing comment'),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    name: 'checklist.0',
    label: 'Inspect motor',
    isDisabled: false,
    hasError: false,
  };

  const ControlledChecklistItemComponent = (props?: Partial<ControlledChecklistItemProps<{ checklist: [] }>>) => (
    <ControlledChecklistItem {...defaultProps} {...props} />
  );

  it('should render the BaseChecklistItem with label', () => {
    render(ControlledChecklistItemComponent());

    expect(screen.getByTestId('base-item')).toBeInTheDocument();
    expect(screen.getByTestId('label')).toHaveTextContent('Inspect motor');
  });

  it('should render the comment input with watched value', () => {
    render(ControlledChecklistItemComponent());

    const commentInput = screen.getByTestId('comment-input') as HTMLInputElement;

    expect(commentInput.value).toBe('Existing comment');
  });

  it('should render the checkbox input', () => {
    render(ControlledChecklistItemComponent());

    const checkbox = screen.getByTestId('checkbox') as HTMLInputElement;

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
    expect(checkbox).toBeEnabled();
  });

  it('should display error when hasError is true', () => {
    render(ControlledChecklistItemComponent({ hasError: true }));

    expect(screen.getByTestId('error')).toBeInTheDocument();
    expect(screen.getByTestId('error')).toHaveTextContent('error');
  });

  it('should disable checkbox and input when isDisabled is true', () => {
    render(ControlledChecklistItemComponent({ isDisabled: true }));

    const checkbox = screen.getByTestId('checkbox') as HTMLInputElement;
    const commentInput = screen.getByTestId('comment-input') as HTMLInputElement;

    expect(checkbox).toBeDisabled();
    expect(commentInput).toBeDisabled();
  });

  it('should call onChange of checkbox when clicked', () => {
    mockController.mockImplementationOnce(({ name, render }) => {
      const field = {
        name,
        value: false,
        onChange: onChangeMock,
      };

      return render({ field });
    });

    render(ControlledChecklistItemComponent());

    const checkbox = screen.getByTestId('checkbox') as HTMLInputElement;

    fireEvent.click(checkbox);

    expect(onChangeMock).toHaveBeenCalledWith(true);
  });

  it('should call onChange of comment input when value changes', () => {
    render(ControlledChecklistItemComponent());

    const commentInput = screen.getByTestId('comment-input') as HTMLInputElement;

    fireEvent.change(commentInput, { target: { value: 'New comment' } });

    expect(onChangeMock).toHaveBeenCalledWith('New comment');
  });
});
