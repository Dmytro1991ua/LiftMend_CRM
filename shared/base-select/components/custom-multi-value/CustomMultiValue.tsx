import { components } from 'react-select';

import { CustomMultiValueProps, DropdownOption, DropdownOptionGroup } from '../../types';

const DEFAULT_MAX_VISIBLE_OPTIONS_COUNT = 10;

export const CustomMultiValue = <T extends string, IsMulti extends boolean>(
  props: CustomMultiValueProps<T, IsMulti>
): React.JSX.Element | null => {
  const { maxVisibleOptionsCount = DEFAULT_MAX_VISIBLE_OPTIONS_COUNT } = props.selectProps;

  const selectedValues = props.getValue();
  const selectedValueIndex = selectedValues.indexOf(props.data);
  const isLastMaxDisplayedValue =
    selectedValueIndex === maxVisibleOptionsCount - 1 && selectedValues.length > maxVisibleOptionsCount;
  const remainingValuesCount = selectedValues.length - maxVisibleOptionsCount;

  // If the current item is beyond the max displayed values, don't render it
  if (selectedValueIndex >= maxVisibleOptionsCount) {
    return null;
  }

  const modifiedProps = [
    {
      ...props,
      innerProps: {
        ...props.innerProps,
        'aria-disabled': props?.isDisabled,
        'aria-focused': props?.isFocused,
      },
    },
  ];

  return (
    <>
      {/* @ts-ignore */}
      <components.MultiValue<DropdownOption<T>, IsMulti, DropdownOptionGroup<T>>
        {...modifiedProps}
        isDisabled={props?.isDisabled}
        isFocused={props?.isFocused}
      >
        {/* @ts-ignore */}
        <components.MultiValueLabel {...props}>{props.children}</components.MultiValueLabel>
      </components.MultiValue>
      {/* If this is the last item to be displayed and there are remaining items, show the "+X more" label */}
      {isLastMaxDisplayedValue && (
        <div className='ml-auto'>
          {/* @ts-ignore */}
          <components.MultiValueLabel {...props}>
            <span className='text-sm text-primary'>+{remainingValuesCount} more</span>
          </components.MultiValueLabel>
        </div>
      )}
    </>
  );
};

export default CustomMultiValue;
