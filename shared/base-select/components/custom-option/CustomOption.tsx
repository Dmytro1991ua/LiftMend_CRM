import { OptionProps, components } from 'react-select';

import BaseTooltip from '@/shared/base-tooltip';

import { DropdownOption } from '../../types';

const CustomOption = <T extends string, IsMulti extends boolean>(
  props: OptionProps<DropdownOption<T>, IsMulti>
): React.JSX.Element => {
  const { data } = props;
  const { disabledReason, label, id } = data;

  return (
    <BaseTooltip
      className='!shadow-none'
      disable={!disabledReason}
      id={`option-tooltip-${id}`}
      message={disabledReason ?? ''}
      place='bottom'
    >
      <components.Option {...props}>{label}</components.Option>
    </BaseTooltip>
  );
};

export default CustomOption;
