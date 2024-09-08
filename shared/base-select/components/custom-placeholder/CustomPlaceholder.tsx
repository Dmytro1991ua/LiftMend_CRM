import { components } from 'react-select';

import { CustomPlaceholderProps, DropdownOption, DropdownOptionGroup } from '../../types';

export const CustomPlaceholder = <T extends string, IsMulti extends boolean>({
  isDisabled = false,
  isFocused = false,
  ...props
}: CustomPlaceholderProps<T, IsMulti>): React.JSX.Element => {
  return (
    <components.Placeholder<DropdownOption<T>, IsMulti, DropdownOptionGroup<T>>
      {...props}
      isDisabled={isDisabled}
      isFocused={isFocused}>
      {props.children}
    </components.Placeholder>
  );
};

export default CustomPlaceholder;
