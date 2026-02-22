import { SUCCESSFULLY_CANCELLED_REPAIR_JOB_STATUS_CHANGE } from '@/modules/repair-job-scheduling/constants';

import BaseAlert from '../base-alert/BaseAlert';
import {
  EDIT_BUTTON_CANCELLED_STATUS_TOOLTIP_MESSAGE,
  EDIT_BUTTON_COMPLETED_STATUS_TOOLTIP_MESSAGE,
} from '../base-details-page/constants';

import { getCompletedRepairJobMessage } from './hooks/utils';

export const DETAILS_PAGE_ALERT_MESSAGE: Record<string, React.JSX.Element> = {
  Completed: <BaseAlert description={EDIT_BUTTON_COMPLETED_STATUS_TOOLTIP_MESSAGE} variant='info' />,
  Cancelled: <BaseAlert description={EDIT_BUTTON_CANCELLED_STATUS_TOOLTIP_MESSAGE} variant='info' />,
};

export const STATUS_CHANGE_MESSAGES: Record<string, (elevatorType?: string) => string> = {
  Completed: getCompletedRepairJobMessage,
  Cancelled: () => SUCCESSFULLY_CANCELLED_REPAIR_JOB_STATUS_CHANGE,
};
