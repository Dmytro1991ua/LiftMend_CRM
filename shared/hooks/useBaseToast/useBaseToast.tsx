import { useCallback, useMemo } from 'react';
import { AiFillCheckCircle, AiFillInfoCircle, AiFillWarning } from 'react-icons/ai';
import { BiSolidError } from 'react-icons/bi';

import { BaseToastVariant, ToastContent, Variant } from './types';

import { useToast } from '@/components/ui/use-toast';

type UseBaseToast = { baseToast: (message: string) => void };

export const useBaseToast = (variant: BaseToastVariant): UseBaseToast => {
  const { toast } = useToast();

  const BASE_TOAST_CONFIG: Record<BaseToastVariant, ToastContent> = useMemo(() => {
    const commonIconStyles = 'mr-2';

    return {
      [BaseToastVariant.Error]: {
        icon: <BiSolidError className={commonIconStyles} />,
        variant: Variant.Destructive,
      },
      [BaseToastVariant.Info]: {
        icon: <AiFillInfoCircle className={commonIconStyles} />,
        variant: Variant.Info,
      },
      [BaseToastVariant.Success]: {
        icon: <AiFillCheckCircle className={commonIconStyles} />,
        variant: Variant.Success,
      },
      [BaseToastVariant.Warning]: {
        icon: <AiFillWarning className={commonIconStyles} />,
        variant: Variant.Warning,
      },
    };
  }, []);

  const toastContent = useCallback(
    (message: string) => {
      const config = BASE_TOAST_CONFIG[variant];

      return {
        action: (
          <div className='w-full flex items-center'>
            {config.icon}
            <span className='first-letter:capitalize'>{message}</span>
          </div>
        ),
        variant: config.variant,
      };
    },
    [BASE_TOAST_CONFIG, variant]
  );

  const baseToast = useCallback((message: string) => toast({ ...toastContent(message) }), [toast, toastContent]);

  return { baseToast };
};
