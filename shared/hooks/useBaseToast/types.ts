export enum BaseToastVariant {
  Info = 'info',
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
}

export enum Variant {
  Default = 'default',
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
  Destructive = 'destructive',
}

export type ToastVariant = 'default' | 'destructive' | 'info' | 'success' | 'warning' | null | undefined;

export type ToastContent = {
  icon: React.JSX.Element;
  variant: ToastVariant;
};
