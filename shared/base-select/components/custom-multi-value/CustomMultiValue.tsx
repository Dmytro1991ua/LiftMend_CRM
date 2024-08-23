import { components } from 'react-select';

import { CustomMultiValueProps } from '../../types';

const DEFAULT_MAX_VISIBLE_OPTIONS_COUNT = 10;

const CustomMultiValue = <T extends string, IsMulti extends boolean>(
  props: CustomMultiValueProps<T, IsMulti>
): React.JSX.Element | null => {
  const { selectProps, ...rest } = props;
  const selectedValues = rest.getValue();

  if (!Array.isArray(selectedValues)) {
    return null;
  }

  const { maxVisibleOptionsCount = DEFAULT_MAX_VISIBLE_OPTIONS_COUNT } = selectProps;

  const selectedValueIndex = selectedValues.findIndex((value) => value.value === rest.data.value);
  const isLastMaxDisplayedValue =
    selectedValueIndex === maxVisibleOptionsCount - 1 && selectedValues.length > maxVisibleOptionsCount;
  const remainingValuesCount = selectedValues.length - maxVisibleOptionsCount;
  // If the current item is beyond the max displayed values, don't render it
  if (selectedValueIndex >= maxVisibleOptionsCount) {
    return null;
  }

  return (
    <>
      {/* @ts-ignore */}
      <components.MultiValue {...rest} isDisabled={rest?.isDisabled} isFocused={rest?.isFocused}>
        {/* @ts-ignore */}
        <components.MultiValueLabel {...rest}>{rest.children} </components.MultiValueLabel>
      </components.MultiValue>
      {/* If this is the last item to be displayed and there are remaining items, show the "+X more" label */}{' '}
      {isLastMaxDisplayedValue && (
        <div className='ml-auto'>
          {/* @ts-ignore */}
          <components.MultiValueLabel {...rest}>
            <span className='text-sm text-primary'>+{remainingValuesCount} more</span>
          </components.MultiValueLabel>
        </div>
      )}
    </>
  );
};

export default CustomMultiValue;
