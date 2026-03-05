import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import BaseModal from '../base-modal';
import ModalFooter from '../base-modal/modal-footer';
import BaseTooltip from '../base-tooltip';

export type BaseEntityStatusTriggerProps = {
  variant?: 'icon' | 'button';
  children?: React.ReactNode;
  isTooltipShown?: boolean;
  tooltipMessage?: string;
  buttonIcon?: React.JSX.Element;
  buttonIconTestId?: string;
  isButtonDisabled?: boolean;
  buttonLabel?: string;
  isModalOpen?: boolean;
  modalTitle?: string;
  modalMessage?: string;
  isLoading?: boolean;
  wrapperClassName?: string;
  onOpenModal?: () => void;
  onCloseModal?: () => void;
  onConfirm?: () => Promise<void> | void;
};

const BaseEntityStatusTrigger = ({
  variant = 'icon',
  children,
  tooltipMessage = '',
  isTooltipShown,
  buttonIcon,
  buttonLabel,
  buttonIconTestId,
  isButtonDisabled = false,
  isModalOpen = false,
  isLoading = false,
  modalMessage,
  modalTitle,
  wrapperClassName,
  onOpenModal,
  onCloseModal,
  onConfirm,
}: BaseEntityStatusTriggerProps) => {
  const isIconOnly = variant === 'icon';
  const buttonVariant = isIconOnly ? 'ghost' : 'default';
  const shouldShowText = variant === 'button';

  return (
    <section className={wrapperClassName}>
      <BaseTooltip
        className='w-[30rem] !shadow-none'
        disable={isTooltipShown}
        id='base-entity-status-transition-tooltip'
        message={tooltipMessage}
        place='left'>
        <Button
          className={isIconOnly ? 'hover:bg-transparent' : ''}
          data-testid='status-toggle-btn'
          disabled={isButtonDisabled}
          variant={buttonVariant}
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal?.();
          }}>
          <div data-testid={buttonIconTestId}>{buttonIcon}</div>
          {shouldShowText && <span className='ml-2'>{buttonLabel}</span>}
        </Button>
      </BaseTooltip>
      <BaseModal
        isOpen={isModalOpen}
        modalFooter={
          <ModalFooter
            cancelButtonLabel='No'
            isDisabled={isLoading}
            isLoading={isLoading}
            submitButtonLabel='Yes'
            onCancel={onCloseModal}
            onSubmit={onConfirm}
          />
        }
        title={modalTitle}
        onClose={onCloseModal}>
        <h3 className={cn('text-sm text-muted-foreground', children ? 'mb-4' : 'mb-0')}>{modalMessage}</h3>
        {children}
      </BaseModal>
    </section>
  );
};

export default BaseEntityStatusTrigger;
