import gql from 'graphql-tag';

export const DELETE_REPAIR_JOB_AND_EVENT = gql`
  mutation DeleteRepairJobAndEvent($calendarEventId: ID!, $repairJobId: ID!) {
    deleteRepairJobAndEvent(calendarEventId: $calendarEventId, repairJobId: $repairJobId) {
      deletedEventId
      deletedRepairJobId
    }
  }
`;
