import { FieldValues, Path, PathValue, UseFormClearErrors } from 'react-hook-form';
import {
  ActionMeta,
  DeselectOptionActionMeta,
  InputActionMeta,
  MultiValueProps,
  OnChangeValue,
  PlaceholderProps,
  Props,
  RemoveValueActionMeta,
  SelectOptionActionMeta,
  SingleValueProps,
  ValueContainerProps,
} from 'react-select';
import { MenuListComponentProps } from 'react-select/src/components/Menu';
import { OptionsType, ValueType } from 'react-select/src/types';

export type DropdownOption<T = string> = {
  id?: string;
  label: string;
  value: T;
  isDisabled?: boolean;
};

export interface DropdownOptionGroup<T = string> {
  label: string;
  options: DropdownOption<T>[];
}

export type MultiSelectValue<T = string> = ValueType<DropdownOption<T>, true>;
export type SingleSelectValue<T = string> = ValueType<DropdownOption<T>, false>;

export interface MultiSelectProps<T extends string> extends Omit<BaseSelectProps<T, true>, 'onChange' | 'value'> {
  value?: MultiSelectValue<T>;
  onChange?: (value: MultiSelectValue<T>, actionMeta: CombinedActionMeta<T>) => void;
  onSelectAll?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, options: DropdownOption<T>[]) => void;
  onClearAll?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  multipleSelectControls?: boolean;
  hasError?: boolean;
  defaultValue?: MultiSelectValue<T>;
}

export interface SingleSelectProps<T extends string> extends Omit<BaseSelectProps<T, false>, 'onChange' | 'value'> {
  value?: SingleSelectValue<T>;
  hasSearchInput?: boolean;
  onChange?: (value: SingleSelectValue<T>, actionMeta: ActionMeta<SingleSelectValue<T>>) => void;
  hasError?: boolean;
}

export type CombinedActionMeta<T> =
  | ActionMeta<DropdownOption<T>>
  | SelectOptionActionMeta<DropdownOption<T>>
  | DeselectOptionActionMeta<DropdownOption<T>>
  | RemoveValueActionMeta<DropdownOption<T>>;

export interface BaseSelectProps<T extends string, IsMulti extends boolean>
  extends Props<DropdownOption<T>, IsMulti, DropdownOptionGroup<T>> {
  /** Array of options to display in the dropdown */
  options: DropdownOption<T>[];

  /** Current value of the select. Can be a single value or multiple values based on IsMulti */
  value?: IsMulti extends true ? MultiSelectValue<T> : SingleSelectValue<T> | null;

  /** Function called when the value changes */
  onChange?: (newValue: OnChangeValue<DropdownOption<T>, IsMulti>, actionMeta: CombinedActionMeta<T>) => void;

  /** Placeholder text displayed when no option is selected */
  placeholder?: string;

  /** Current input value for the search input */
  inputValue?: string;

  /** Function called to fetch the next set of options */
  onNext?: () => void;

  /** Indicates if there are more options to load */
  hasMore?: boolean;

  /** Indicates if the select includes a search input */
  hasSearchInput?: boolean;

  /** Indicates if multiple options can be selected */
  isMultiSelect?: IsMulti;

  /** Function called when the input value changes */
  onInputChange?: (newValue: string, actionMeta: InputActionMeta) => void;

  /** Function called to clear all selected options */
  onClearAll?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;

  /** Function called to select all options */
  onSelectAll?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, options: DropdownOption<T>[]) => void;

  /** Indicates if multiple select controls (e.g., select all, clear all) are available */
  multipleSelectControls?: boolean;

  /** Placeholder text for the search input */
  searchInputPlaceholder?: string;

  /** Maximum number of visible options before showing a scroll */
  maxVisibleOptionsCount?: number;

  /** Indicates if the select has an error state */
  hasError?: boolean;

  /** Indicates if the select is currently focused */
  isFocused?: boolean;

  /** Indicates if the select is currently disabled */
  isDisabled?: boolean;

  /** Indicates Select default value */
  defaultValue?: IsMulti extends true ? MultiSelectValue<T> : SingleSelectValue<T> | null;
}

export type CustomValueContainerProps<T extends string, IsMulti extends boolean> = ValueContainerProps<
  DropdownOption<T>,
  IsMulti,
  DropdownOptionGroup<T>
> & {
  selectProps: BaseSelectProps<T, IsMulti>;
};

export interface CustomMultiValueProps<T extends string, IsMulti extends boolean>
  extends Omit<MultiValueProps<DropdownOption<T>, IsMulti, DropdownOptionGroup<T>>, 'selectProps'> {
  isDisabled: boolean;
  isFocused: boolean;
  selectProps: BaseSelectProps<T, IsMulti>;
}

export interface CustomSingleValueProps<T extends string, IsMulti extends boolean>
  extends SingleValueProps<DropdownOption<T>, IsMulti, DropdownOptionGroup<T>> {
  isDisabled: boolean;
  isFocused?: boolean;
}

export type CustomSearchInputProps<T extends string, IsMulti extends boolean> = {
  selectProps: BaseSelectProps<T, IsMulti>;
};

export interface CustomPlaceholderProps<T extends string, IsMulti extends boolean>
  extends PlaceholderProps<DropdownOption<T>, IsMulti, DropdownOptionGroup<T>> {
  isDisabled: boolean;
  isFocused: boolean;
}

export type CustomMultiControlProps<T extends string, IsMulti extends boolean> = {
  selectProps: BaseSelectProps<T, IsMulti>;
  hasValue: boolean;
  getValue: () => OptionsType<DropdownOption<T>>;
};

export type CustomMenuListProps<T extends string, IsMulti extends boolean> = MenuListComponentProps<
  DropdownOption<T>,
  IsMulti,
  DropdownOptionGroup<T>
> & {
  selectProps: BaseSelectProps<T, IsMulti>;
};

export interface ControlledSingleSelectProps<T extends FieldValues>
  extends Omit<BaseSelectProps<string, false>, 'onChange' | 'value'> {
  name: Path<T>;
  options: DropdownOption<string>[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  clearErrors?: UseFormClearErrors<T>;
  defaultValue?: PathValue<T, Path<T>> | undefined;
}

export interface ControlledMultiSelectProps<T extends FieldValues>
  extends Omit<BaseSelectProps<string, true>, 'onChange' | 'value'> {
  name: Path<T>;
  options: DropdownOption<string>[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  clearErrors?: UseFormClearErrors<T>;
  defaultValue?: PathValue<T, Path<T>> | undefined;
}
