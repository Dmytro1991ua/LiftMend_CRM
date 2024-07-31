import React from 'react';

import { components } from 'react-select';

import { CustomValueContainerProps } from '../../types';
import CustomMultiValue from '../custom-multi-value';
import CustomPlaceholder from '../custom-placeholder';
import CustomSingleValue from '../custom-single-value';

export const CustomValueContainer = <T extends string, IsMulti extends boolean>({
  children,
  selectProps,
  ...props
}: CustomValueContainerProps<T, IsMulti>): React.JSX.Element => {
  const commonProps = {
    cx: props.cx,
    clearValue: props.clearValue,
    getStyles: props.getStyles,
    getValue: props.getValue,
    hasValue: props.hasValue,
    isMulti: props.isMulti,
    isRtl: props.isRtl,
    options: props.options,
    selectOption: props.selectOption,
    setValue: props.setValue,
    selectProps,
    theme: props.theme,
    getClassNames: props.getClassNames,
    innerProps: props.innerProps,
  };

  return (
    <components.ValueContainer {...props} selectProps={selectProps}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // Check if the child is MultiValue and replace it with CustomMultiValue
          if (child.type === components.MultiValue) {
            return <CustomMultiValue {...child.props} />;
          }
          return child;
        }

        return props.hasValue ? (
          <CustomSingleValue<T, IsMulti>
            {...commonProps}
            data={props.getValue()[0]}
            innerProps={{}}
            isDisabled={selectProps.isDisabled}
            isFocused={selectProps?.isFocused}
          >
            {selectProps.getOptionLabel ? selectProps.getOptionLabel(props.getValue()[0]) : ''}
          </CustomSingleValue>
        ) : (
          <CustomPlaceholder<T, IsMulti>
            {...commonProps}
            innerProps={{}}
            isDisabled={selectProps?.isDisabled || false}
            isFocused={selectProps?.isFocused || false}
          >
            {selectProps?.placeholder}
          </CustomPlaceholder>
        );
      })}
    </components.ValueContainer>
  );
};

export default CustomValueContainer;
