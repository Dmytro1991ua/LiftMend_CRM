import { COMPLETE_BUTTON_TOOLTIP_MESSAGES } from './constant';
import { CompleteButtonDisabledSate } from './types';

export const getCompleteButtonDisabledState = (status: string): Record<string, CompleteButtonDisabledSate> => {
  return {
    Completed: {
      isCompleteButtonDisabled: status === 'Completed',
      tooltipMessage: COMPLETE_BUTTON_TOOLTIP_MESSAGES.Completed,
    },
    Cancelled: {
      isCompleteButtonDisabled: status === 'Cancelled',
      tooltipMessage: COMPLETE_BUTTON_TOOLTIP_MESSAGES.Cancelled,
    },
    Scheduled: {
      isCompleteButtonDisabled: status === 'Scheduled',
      tooltipMessage: COMPLETE_BUTTON_TOOLTIP_MESSAGES.Scheduled,
    },
    'On Hold': {
      isCompleteButtonDisabled: status === 'On Hold',
      tooltipMessage: COMPLETE_BUTTON_TOOLTIP_MESSAGES['On Hold'],
    },
  };
};
