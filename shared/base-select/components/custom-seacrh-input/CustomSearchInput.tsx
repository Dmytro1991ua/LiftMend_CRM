import { InputActionMeta } from 'react-select';

import { CustomSearchInputProps } from '../../types';

const CustomSearchInput = <T extends string, IsMulti extends boolean>({
  selectProps,
}: CustomSearchInputProps<T, IsMulti>) => {
  const ariaAttributes = {
    'aria-autocomplete': 'list' as const,
    'aria-label': selectProps['aria-label'],
    'aria-labelledby': selectProps['aria-labelledby'],
  };

  const onHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const actionMeta: InputActionMeta = {
      action: 'input-change',
      prevInputValue: selectProps.inputValue ?? '',
    };

    selectProps?.onInputChange && selectProps.onInputChange(e.currentTarget.value, actionMeta);
  };

  const onHandleMouseDown = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    e.stopPropagation();

    (e.target as HTMLInputElement).focus();
  };

  const onHandleTouchEnd = (e: React.TouchEvent<HTMLInputElement>) => {
    e.stopPropagation();

    (e.target as HTMLInputElement).focus();
  };

  return (
    <input
      autoComplete='off'
      autoCorrect='off'
      className='w-full p-2 border-b border-gray-200'
      placeholder={selectProps?.searchInputPlaceholder}
      spellCheck='false'
      type='text'
      value={selectProps?.inputValue}
      onChange={onHandleChange}
      onFocus={selectProps?.onFocus}
      onMouseDown={onHandleMouseDown}
      onTouchEnd={onHandleTouchEnd}
      {...ariaAttributes}
    />
  );
};

export default CustomSearchInput;
