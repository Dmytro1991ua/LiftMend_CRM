import gql from 'graphql-tag';

export const DELETE_REPAIR_JOB_AND_EVENT = gql`
  mutation DeleteRepairJobAndEvent($repairJobId: ID!) {
    deleteRepairJobAndEvent(repairJobId: $repairJobId) {
      deletedEventId
      deletedRepairJobId
    }
  }
`;
