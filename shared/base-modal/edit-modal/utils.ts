export const getModalTitle = (title: string, isEdit?: boolean, description = ''): string => {
  const modalActionString = isEdit ? 'Edit' : 'Delete';

  return `${modalActionString} ${title} ${description}`;
};

export const getModalDescription = (title: string, description = ''): string =>
  `Are you sure you want to delete ${title} ${description}?`;
