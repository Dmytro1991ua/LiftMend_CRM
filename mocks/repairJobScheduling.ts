import { MockedResponse } from '@apollo/client/testing';

import { GET_AVAILABLE_TECHNICIANS_FOR_ASSIGNMENT } from '@/graphql/schemas';
import { GetAvailableTechniciansForAssignmentQuery } from '@/graphql/types/client/generated_types';

export const mockAvailableTechnician = {
  id: 'test-id-1',
  name: 'Charles Robinson',
};

export const mockAvailableTechniciansResponse: MockedResponse<GetAvailableTechniciansForAssignmentQuery> = {
  request: {
    query: GET_AVAILABLE_TECHNICIANS_FOR_ASSIGNMENT,
  },
  result: {
    data: {
      getAvailableTechniciansForAssignment: [{ ...mockAvailableTechnician, __typename: 'TechnicianRecord' }],
    },
    errors: [],
  },
};
