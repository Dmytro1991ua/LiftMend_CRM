import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import { BaseModalProps } from './types';

const BaseModal = ({
  isOpen,
  title,
  description,
  children,
  modalContentClassName,
  modalFooter,
  onClose,
}: BaseModalProps): React.JSX.Element => {
  return (
    <Dialog modal defaultOpen={isOpen} open={isOpen} onOpenChange={onClose}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className={cn('px-6 overflow-auto', modalContentClassName)}>{children}</div>
        <DialogFooter>{modalFooter}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BaseModal;
