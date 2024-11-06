import gql from 'graphql-tag';

export const GET_TECHNICIAN_RECORD_FORM_DATA = gql`
  query GetTechnicianRecordFormData {
    getTechnicianRecordFormData {
      availabilityStatuses
      certifications
      employmentStatuses
      skills
    }
  }
`;
