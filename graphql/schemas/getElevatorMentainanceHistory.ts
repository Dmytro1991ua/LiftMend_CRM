import gql from 'graphql-tag';

import { REPAIR_JOB_FRAGMENT } from '@/graphql/fragments';

export const GET_ELEVATOR_MENTAINANCE_HISTORY = gql`
  query GetElevatorMentainanceHistory(
    $buildingName: String!
    $elevatorLocation: String!
    $paginationOptions: PaginationOptions
  ) {
    getElevatorMentainanceHistory(
      buildingName: $buildingName
      elevatorLocation: $elevatorLocation
      paginationOptions: $paginationOptions
    ) {
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
