import { get as _get } from 'lodash';
import { FieldErrors, FieldValues } from 'react-hook-form';
import { Bars } from 'react-loader-spinner';

import BaseAlert from '@/shared/base-alert/BaseAlert';
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

export const handleQueryResponse = ({ loading, error }: { loading: boolean; error?: string | null }) => {
  if (loading) {
    return (
      <Bars
        ariaLabel='bars-loading'
        color='#2563eb'
        height='80'
        visible={true}
        width='80'
        wrapperClass='justify-center'
      />
    );
  }

  if (error) {
    return <BaseAlert description={error} title='Error occurred' variant='destructive' />;
  }

  return null;
};
