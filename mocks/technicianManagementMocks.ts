import { MockedResponse } from '@apollo/client/testing';

import { GET_TECHNICIAN_RECORD_BY_ID, GET_TECHNICIAN_RECORD_FORM_DATA } from '@/graphql/schemas';
import { GetTechnicianRecordByIdQuery, GetTechnicianRecordFormDataQuery } from '@/graphql/types/client/generated_types';

export const mockTechnicianContactInfo = 'benjamin.hall@example.com';
export const mockTechnicianSkills = ['Electrical', 'Mechanical', 'Troubleshooting'];
export const mockTechnicianCertifications = ['Certified Elevator Technician', 'First Aid Certification'];
export const mockAvailableTechnicianStatuses = ['Active', 'Inactive'];
export const mockTechnicianRecordId = 'test-technician-id-1';

export const mockBenjaminHallRecord = {
  id: mockTechnicianRecordId,
  name: 'Benjamin Hall',
  contactInformation: mockTechnicianContactInfo,
  skills: mockTechnicianSkills,
  certifications: mockTechnicianCertifications,
  availabilityStatus: 'Available',
  employmentStatus: 'Active',
  lastKnownAvailabilityStatus: null,
};

export const mockOliviaLewisRecord = {
  id: 'test-technician-id-2',
  name: 'Olivia Lewis',
  contactInformation: 'olivia.lewis@example.com',
  skills: ['Blueprint Reading', 'Installation', 'Emergency Response'],
  certifications: ['Confined Space Entry Certification', 'Fall Protection Certification'],
  availabilityStatus: 'Available',
  employmentStatus: 'Active',
  lastKnownAvailabilityStatus: null,
};

export const mockTechnicianRecordsFormData: MockedResponse<GetTechnicianRecordFormDataQuery> = {
  request: {
    query: GET_TECHNICIAN_RECORD_FORM_DATA,
  },
  result: {
    data: {
      getTechnicianRecordFormData: {
        employmentStatuses: mockAvailableTechnicianStatuses,
        availabilityStatuses: mockAvailableTechnicianStatuses,
        skills: mockTechnicianSkills,
        certifications: mockTechnicianCertifications,
        __typename: 'TechnicianRecordFormData',
      },
    },
  },
};

export const mockTechnicianRecordById: MockedResponse<GetTechnicianRecordByIdQuery> = {
  request: {
    query: GET_TECHNICIAN_RECORD_BY_ID,
    variables: {
      id: mockTechnicianRecordId,
    },
  },
  result: {
    data: {
      getTechnicianRecordById: { ...mockBenjaminHallRecord, __typename: 'TechnicianRecord' },
    },
  },
};

export const mockTechnicianRecordByIdError: MockedResponse<GetTechnicianRecordByIdQuery> = {
  request: {
    query: GET_TECHNICIAN_RECORD_BY_ID,
    variables: { id: 'test-id-error' },
  },
  error: new Error('Something went wrong!'),
};
