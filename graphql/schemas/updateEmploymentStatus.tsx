import gql from 'graphql-tag';

export const UPDATE_EMPLOYMENT_STATUS = gql`
  mutation UpdateEmploymentStatus(
    $id: ID!
    $employmentStatus: String!
    $availabilityStatus: String!
    $lastKnownAvailabilityStatus: String
  ) {
    updateEmploymentStatus(
      id: $id
      employmentStatus: $employmentStatus
      availabilityStatus: $availabilityStatus
      lastKnownAvailabilityStatus: $lastKnownAvailabilityStatus
    ) {
      id
      employmentStatus
      availabilityStatus
      lastKnownAvailabilityStatus
    }
  }
`;
