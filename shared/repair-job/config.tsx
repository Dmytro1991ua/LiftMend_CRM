import {
  SUCCESSFULLY_CANCELLED_REPAIR_JOB_STATUS_CHANGE,
  SUCCESSFULLY_COMPLETED_REPAIR_JOB_STATUS_CHANGE,
} from '@/modules/repair-job-scheduling/constants';
import {
  EDIT_BUTTON_CANCELLED_STATUS_TOOLTIP_MESSAGE,
  EDIT_BUTTON_COMPLETED_STATUS_TOOLTIP_MESSAGE,
} from '@/shared/repair-job/constants';

import BaseAlert from '../base-alert/BaseAlert';

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
  };
};

export const DETAILS_PAGE_ALERT_MESSAGE: Record<string, React.JSX.Element> = {
  Completed: <BaseAlert description={EDIT_BUTTON_COMPLETED_STATUS_TOOLTIP_MESSAGE} variant='info' />,
  Cancelled: <BaseAlert description={EDIT_BUTTON_CANCELLED_STATUS_TOOLTIP_MESSAGE} variant='info' />,
};

export const STATUS_CHANGE_MESSAGES: Record<string, string> = {
  Completed: SUCCESSFULLY_COMPLETED_REPAIR_JOB_STATUS_CHANGE,
  Cancelled: SUCCESSFULLY_CANCELLED_REPAIR_JOB_STATUS_CHANGE,
};
