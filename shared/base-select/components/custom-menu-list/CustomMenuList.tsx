import React from 'react';

import InfiniteScroll from 'react-infinite-scroll-component';
import { components } from 'react-select';

import { cn } from '@/lib/utils';

import { CustomMenuListProps } from '../../types';
import CustomMultiControl from '../custom-multi-control';
import CustomSearchInput from '../custom-seacrh-input/CustomSearchInput';

const DEFAULT_LOAD_MORE = (): void => {};

const CustomMenuList = <T extends string, IsMulti extends boolean>({
  options,
  selectProps,
  children,
  innerRef,
  ...props
}: CustomMenuListProps<T, IsMulti>): React.JSX.Element => {
  const { innerProps } = selectProps;

  const renderCustomInput = (
    <> {selectProps.hasSearchInput ? <CustomSearchInput selectProps={selectProps} {...props} /> : null}</>
  );

  const renderCustomMultiControls = (
    <>
      {selectProps?.multipleSelectControls ? (
        <CustomMultiControl getValue={props.getValue} hasValue={props.hasValue} selectProps={selectProps} />
      ) : null}
    </>
  );

  return (
    <components.MenuList
      {...props}
      innerProps={innerProps}
      innerRef={innerRef}
      options={options}
      //@ts-ignore
      selectProps={selectProps}>
      {renderCustomInput}
      {renderCustomMultiControls}
      <div
        ref={innerRef}
        className={cn('relative max-h-[15rem] pr-0 box-border overflow-y-auto')}
        data-testid='scrollable-options'
        id='scrollable-options'>
        <InfiniteScroll
          dataLength={options.length}
          hasMore={selectProps?.hasMore ?? false}
          loader={<p>Loading....</p>}
          next={selectProps?.onNext ?? DEFAULT_LOAD_MORE}
          scrollThreshold={0.99}
          scrollableTarget='scrollable-options'>
          {children}
        </InfiniteScroll>
      </div>
    </components.MenuList>
  );
};

export default CustomMenuList;
