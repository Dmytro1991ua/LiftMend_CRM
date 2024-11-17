import gql from 'graphql-tag';

export const UPDATE_EMPLOYMENT_STATUS = gql`
  mutation UpdateEmploymentStatus($id: ID!, $employmentStatus: String!, $availabilityStatus: String!) {
    updateEmploymentStatus(id: $id, employmentStatus: $employmentStatus, availabilityStatus: $availabilityStatus) {
      id
      employmentStatus
      availabilityStatus
    }
  }
`;
