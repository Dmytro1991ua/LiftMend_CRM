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
  [AlertVariant.Default]: <BsTerminal className={COMMON_ICON_STYLES} />,
  [AlertVariant.Info]: <BsFillInfoCircleFill className={COMMON_ICON_STYLES} />,
  [AlertVariant.Error]: <BiError className={COMMON_ICON_STYLES} />,
  [AlertVariant.Warning]: <AiFillWarning className={COMMON_ICON_STYLES} />,
  [AlertVariant.Success]: <AiFillCheckCircle className={COMMON_ICON_STYLES} />,
};
