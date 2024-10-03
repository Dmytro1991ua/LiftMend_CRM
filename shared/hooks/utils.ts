import { DropdownOption } from '../base-select/types';

export const convertQueryResponseToDropdownOptions = (options: string[]): DropdownOption<string>[] =>
  options.map((option: string) => ({
    value: option,
    label: option,
  }));
