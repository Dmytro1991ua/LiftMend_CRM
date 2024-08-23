import { ReactNode } from 'react';

export type BaseModalProps = {
  isOpen?: boolean;
  title?: string;
  description?: string;
  children?: ReactNode;
  isLoading?: boolean;
  isDisabled?: boolean;
  modalFooter?: React.JSX.Element;
  onClose?: () => void;
  onSubmit?: () => void;
};
