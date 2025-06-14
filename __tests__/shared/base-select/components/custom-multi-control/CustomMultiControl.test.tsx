import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CustomMultiControl from '@/shared/base-select/components/custom-multi-control';
import { CustomMultiControlProps } from '@/shared/base-select/types';

describe('CustomMultiControl', () => {
  const mockOnSelectAll = jest.fn();
  const mockOnClearAll = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    options: [
      { label: 'Option 3', value: 'Option 3', id: '3' },
      { label: 'Option 4', value: 'Option 4', id: '4' },
    ],
    children: (
      <>
        <div>Option 3</div>
        <div>Option 4</div>
      </>
    ),
    selectProps: {
      innerProps: {},
      multipleSelectControls: false,
      onSelectAll: mockOnSelectAll,
      onClearAll: mockOnClearAll,
      options: [
        { label: 'Option 3', value: 'Option 3', id: '3' },
        { label: 'Option 4', value: 'Option 4', id: '4' },
      ],
    },
    getValue: () => [],
    hasValue: false,
    innerRef: jest.fn(),
    getStyles: jest.fn(),
    getClassNames: jest.fn(),
    cx: jest.fn(),
  } as unknown as CustomMultiControlProps<string, true>;

  const CustomMultiControlComponent = (props?: Partial<CustomMultiControlProps<string, true>>) => (
    <CustomMultiControl {...defaultProps} {...props} />
  );

  it('should render component without crashing', () => {
    render(
      CustomMultiControlComponent({
        selectProps: {
          ...defaultProps.selectProps,
          multipleSelectControls: true,
        },
      })
    );

    expect(screen.getByTestId('multiple-select-controls')).toBeInTheDocument();
  });

  it('should render Select All control when not all values are selected and onSelectAll exists', async () => {
    render(
      CustomMultiControlComponent({
        selectProps: {
          ...defaultProps.selectProps,
          multipleSelectControls: true,
        },
        getValue: () => [defaultProps.selectProps.options[0]],
        hasValue: true,
      })
    );

    const selectAllButton = screen.getByTestId('select-all-control');
    expect(selectAllButton).toBeInTheDocument();

    await userEvent.click(selectAllButton);

    expect(mockOnSelectAll).toHaveBeenCalled();
  });

  it('should not render Select All if all options are selected', () => {
    render(
      CustomMultiControlComponent({
        selectProps: {
          ...defaultProps.selectProps,
          multipleSelectControls: true,
        },
        getValue: () => defaultProps.selectProps.options,
        hasValue: true,
      })
    );

    expect(screen.queryByTestId('select-all-control')).not.toBeInTheDocument();
  });

  it('should render Clear All if hasValue is true and onClearAll is defined', async () => {
    render(
      CustomMultiControlComponent({
        selectProps: {
          ...defaultProps.selectProps,
          multipleSelectControls: true,
        },
        hasValue: true,
      })
    );

    const clearAll = screen.getByTestId('clear-all-control');
    expect(clearAll).toBeInTheDocument();

    await userEvent.click(clearAll);

    expect(mockOnClearAll).toHaveBeenCalled();
  });

  it('should not render Clear All if hasValue is false', () => {
    render(
      CustomMultiControlComponent({
        selectProps: {
          ...defaultProps.selectProps,
          multipleSelectControls: true,
        },
        hasValue: false,
      })
    );

    expect(screen.queryByTestId('clear-all-control')).not.toBeInTheDocument();
  });

  it('should render divider "/" only if Select All is visible and hasValue is true', () => {
    render(
      CustomMultiControlComponent({
        selectProps: {
          ...defaultProps.selectProps,
          multipleSelectControls: true,
          onSelectAll: mockOnSelectAll,
        },
        getValue: () => [defaultProps.selectProps.options[0]],
        hasValue: true,
      })
    );

    const controls = screen.getByTestId('multiple-select-controls');

    expect(controls).toHaveTextContent('/');
  });

  it('should not render divider "/" if Select All is not visible', () => {
    render(
      CustomMultiControlComponent({
        selectProps: {
          ...defaultProps.selectProps,
          multipleSelectControls: true,
          onSelectAll: undefined,
        },
        hasValue: true,
      })
    );

    const controls = screen.getByTestId('multiple-select-controls');

    expect(controls).not.toHaveTextContent('/');
  });
});
