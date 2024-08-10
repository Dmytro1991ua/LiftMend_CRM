import { useCallback, useMemo } from 'react';

import { AiFillCheckCircle, AiFillInfoCircle, AiFillWarning } from 'react-icons/ai';
import { BiSolidError } from 'react-icons/bi';

import { useToast } from '@/components/ui/use-toast';

import { BaseToastVariant, ToastContent, Variant } from './types';

type UseBaseToast = { baseToast: (message: string, description: string) => void };

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
    (message: string, description: string) => {
      const config = BASE_TOAST_CONFIG[variant];

      return {
        action: (
          <div className='w-full flex items-center'>
            {config.icon}
            <div className='flex flex-col ml-2'>
              <span className='first-letter:capitalize text-lg font-semibold'>{message}</span>
              <span className='first-letter:capitalize text-sm'>{description}</span>
            </div>
          </div>
        ),
        variant: config.variant,
      };
    },
    [BASE_TOAST_CONFIG, variant]
  );

  const baseToast = useCallback(
    (message: string, description = '') => toast({ ...toastContent(message, description) }),
    [toast, toastContent]
  );

  return { baseToast };
};
