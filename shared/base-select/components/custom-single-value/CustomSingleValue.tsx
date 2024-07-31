import { components } from 'react-select';

import { CustomSingleValueProps, DropdownOption, DropdownOptionGroup } from '../../types';

export const CustomSingleValue = <T extends string, IsMulti extends boolean>({
  isDisabled = false,
  isFocused = false,
  ...props
}: CustomSingleValueProps<T, IsMulti>): React.JSX.Element => {
  const modifiedProps = {
    ...props,
    innerProps: {
      ...props.innerProps,
      'aria-disabled': isDisabled,
      'aria-focused': isFocused,
    },
  };

  return (
    <components.SingleValue<DropdownOption<T>, IsMulti, DropdownOptionGroup<T>>
      {...modifiedProps}
      isDisabled={isDisabled}
    >
      {props.children}
    </components.SingleValue>
  );
};

export default CustomSingleValue;
