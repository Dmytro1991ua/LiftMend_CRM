import { AiFillCheckCircle, AiFillWarning } from 'react-icons/ai';
import { BiError } from 'react-icons/bi';
import { BsFillInfoCircleFill, BsTerminal } from 'react-icons/bs';

export enum AlertVariant {
  Default = 'default',
  Error = 'destructive',
  Info = 'info',
  Warning = 'warning',
  Success = 'success',
}

const COMMON_ICON_STYLES = 'h-[1.8rem] w-[1.8rem]';

export const ALERT_VARIANT: Record<AlertVariant, React.JSX.Element> = {
  [AlertVariant.Default]: <BsTerminal className={COMMON_ICON_STYLES} data-testid='default-alert-variant' />,
  [AlertVariant.Info]: <BsFillInfoCircleFill className={COMMON_ICON_STYLES} data-testid='info-alert-variant' />,
  [AlertVariant.Error]: <BiError className={COMMON_ICON_STYLES} data-testid='error-alert-variant' />,
  [AlertVariant.Warning]: <AiFillWarning className={COMMON_ICON_STYLES} data-testid='warning-alert-variant' />,
  [AlertVariant.Success]: <AiFillCheckCircle className={COMMON_ICON_STYLES} data-testid='success-alert-variant' />,
};
