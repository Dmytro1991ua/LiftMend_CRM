import gql from 'graphql-tag';

import { REPAIR_JOB_FRAGMENT } from '@/graphql/fragments';

export const GET_ELEVATOR_MAINTENANCE_HISTORY = gql`
  query getElevatorMaintenanceHistory($elevatorId: ID!, $paginationOptions: PaginationOptions) {
    getElevatorMaintenanceHistory(elevatorId: $elevatorId, paginationOptions: $paginationOptions) {
      edges {
        cursor
        node {
          status
          ...RepairJobFields
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      total
    }
  }

  ${REPAIR_JOB_FRAGMENT}
`;
