import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { BaseModalProps } from './types';

const BaseModal = ({
  isOpen,
  title,
  description,
  children,
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
        <div className='px-6 overflow-auto'>{children}</div>
        <DialogFooter>{modalFooter}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BaseModal;
