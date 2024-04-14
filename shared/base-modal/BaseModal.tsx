import { ReactNode } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type BaseModalProps = {
  isOpen?: boolean;
  title?: string;
  description?: string;
  children?: ReactNode;
  modalFooter?: React.JSX.Element;
  onClose?: () => void;
};

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
      <DialogContent>
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
