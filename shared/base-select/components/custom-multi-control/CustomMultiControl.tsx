import React, { useMemo } from 'react';

import { CustomMultiControlProps, DropdownOption } from '../../types';

const CustomMultiControl = <T extends string, IsMulti extends boolean>({
  selectProps,
  hasValue,
  getValue,
}: CustomMultiControlProps<T, IsMulti>): React.JSX.Element => {
  const { options } = selectProps;

  const selectAllOptions = useMemo(() => {
    return options
      ? options
          .map((option) => {
            return 'options' in option ? option.options : option;
          })
          .flat()
      : [];
  }, [options]) as DropdownOption<T>[];

  const values = getValue();

  const isSelectAllVisible = useMemo(() => {
    return !!values && selectAllOptions.length !== values.length && selectProps?.onSelectAll;
  }, [selectProps?.onSelectAll, selectAllOptions.length, values]);

  return (
    <>
      {selectProps?.multipleSelectControls ? (
        <div
          className='flex items-center justify-end gap-2 mb-2 p-2 border-b border-gray-200'
          data-testid='multiple-select-controls'
        >
          {isSelectAllVisible && (
            <span
              className='flex justify-between text-primary text-sm cursor-pointer hover:underline'
              data-testid='select-all-control'
              onClick={(e): void => selectProps?.onSelectAll && selectProps.onSelectAll(e, selectAllOptions)}
            >
              Select All
            </span>
          )}
          {isSelectAllVisible && hasValue && '/'}
          {hasValue && selectProps?.onClearAll && (
            <span
              className='text-red-600 text-sm cursor-pointer hover:underline'
              data-testid='clear-all-control'
              onClick={(e) => selectProps?.onClearAll && selectProps.onClearAll(e)}
            >
              Clear All
            </span>
          )}
        </div>
      ) : null}
    </>
  );
};

export default CustomMultiControl;
