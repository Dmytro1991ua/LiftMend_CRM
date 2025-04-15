import { FaCircleInfo } from 'react-icons/fa6';

import BaseTooltip, { BaseTooltipProps } from '../BaseTooltip';

interface InfoTooltip extends Omit<BaseTooltipProps, 'children'> {
  id: string;
  message: string;
  iconColor?: string;
  iconSize?: string;
  isDisabled?: boolean;
  className?: string;
}

const InfoTooltip = ({ id, iconColor, iconSize, className, isDisabled, message, ...rest }: InfoTooltip) => {
  return (
    <BaseTooltip {...rest} className={className} disable={isDisabled} id={id} message={message}>
      <FaCircleInfo className='cursor-pointer' color={iconColor} data-testid='info-icon' fontSize={iconSize} />
    </BaseTooltip>
  );
};

export default InfoTooltip;
