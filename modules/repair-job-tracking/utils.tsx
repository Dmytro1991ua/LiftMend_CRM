import { get as _get } from 'lodash';
import { FieldErrors, FieldValues } from 'react-hook-form';

import { DropdownOption } from '@/shared/base-select/types';

export const getNestedError = <T extends FieldValues>(
  errors: FieldErrors<T>,
  name: string
): FieldErrors<T>[string] | undefined => _get(errors, name) as FieldErrors<T>[string] | undefined;

export const convertQueryResponseToDropdownOptions = (options: string[]): DropdownOption<string>[] =>
  options.map((option: string) => ({
    value: option,
    label: option,
  }));
