import { get as _get } from 'lodash';
import { FieldErrors, FieldValues } from 'react-hook-form';

export const getNestedError = <T extends FieldValues>(
  errors: FieldErrors<T>,
  name: string
): FieldErrors<T>[string] | undefined => _get(errors, name) as FieldErrors<T>[string] | undefined;
