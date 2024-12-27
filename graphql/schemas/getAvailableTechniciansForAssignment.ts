import gql from 'graphql-tag';

export const GET_AVAILABLE_TECHNICIANS_FOR_ASSIGNMENT = gql`
  query GetAvailableTechniciansForAssignment {
    getAvailableTechniciansForAssignment {
      id
      name
    }
  }
`;
