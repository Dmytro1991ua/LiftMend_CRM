export const getModalTitle = (title: string, isEdit?: boolean): string => {
  const modalActionString = isEdit ? 'Edit' : 'Delete';

  return `${modalActionString} ${title}`;
};

export const getModalDescription = (title: string): string => `Are you sure you want to delete ${title}`;
