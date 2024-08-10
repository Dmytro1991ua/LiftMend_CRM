import gql from 'graphql-tag';

import { CALENDAR_EVENT_FRAGMENT, REPAIR_JOB_FRAGMENT } from '../fragments';

export const CREATE_REPAIR_JOB_AND_CALENDAR_EVENT = gql`
  mutation CreateRepairJobAndCalendarEvent(
    $repairJobInput: CreateRepairJobInput!
    $calendarEventInput: CreateCalendarEventInput!
  ) {
    createRepairJobAndEvent(repairJobInput: $repairJobInput, calendarEventInput: $calendarEventInput) {
      repairJob {
        ...RepairJobFields
      }
      calendarEvent {
        ...CalendarEventFields
      }
    }
  }
  ${CALENDAR_EVENT_FRAGMENT}
  ${REPAIR_JOB_FRAGMENT}
`;
