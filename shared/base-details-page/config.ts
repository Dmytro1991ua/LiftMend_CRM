import {
  EDIT_BUTTON_CANCELLED_STATUS_TOOLTIP_MESSAGE,
  EDIT_BUTTON_COMPLETED_STATUS_TOOLTIP_MESSAGE,
  EDIT_BUTTON_OUT_OF_SERVICE_STATUS_TOOLTIP_MESSAGE,
} from './constants';

type EditButtonDisabledSate = {
  isEditButtonDisabled: boolean;
  tooltipMessage: string;
};

export const getEditButtonDisabledState = (status: string): Record<string, EditButtonDisabledSate> => {
  return {
    Completed: {
      isEditButtonDisabled: status === 'Completed',
      tooltipMessage: EDIT_BUTTON_COMPLETED_STATUS_TOOLTIP_MESSAGE,
    },
    Cancelled: {
      isEditButtonDisabled: status === 'Cancelled',
      tooltipMessage: EDIT_BUTTON_CANCELLED_STATUS_TOOLTIP_MESSAGE,
    },
    'Out of Service': {
      isEditButtonDisabled: status === 'Out of Service',
      tooltipMessage: EDIT_BUTTON_OUT_OF_SERVICE_STATUS_TOOLTIP_MESSAGE,
    },
  };
};
