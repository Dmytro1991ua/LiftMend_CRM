import { ApolloError, useMutation } from '@apollo/client';

import { CREATE_TECHNICIAN_RECORD } from '@/graphql/schemas/createTechnicianRecord';
import { CreateTechnicianRecordMutation } from '@/graphql/types/client/generated_types';
import { onHandleMutationErrors } from '@/shared/utils';

import { TechnicianRecordFormFields } from '../components/technician-record-form/validation';
import { DEFAULT_TECHNICIAN_RECORD_FAIL_MESSAGE, DEFAULT_TECHNICIAN_RECORD_SUCCESS_MESSAGE } from '../constants';

type UseCreateTechnicianRecordProps = {
  onSuccess?: (message: string) => void;
  onError?: (errorMessage: string, errorDescription: string) => void;
};

type UseCreateTechnicianRecord = {
  isLoading: boolean;
  onCreateTechnicianRecord: (formFields: TechnicianRecordFormFields) => Promise<void>;
};

const useCreateTechnicianRecord = ({
  onSuccess,
  onError,
}: UseCreateTechnicianRecordProps): UseCreateTechnicianRecord => {
  const [createTechnicianRecord, { loading }] = useMutation<CreateTechnicianRecordMutation>(CREATE_TECHNICIAN_RECORD, {
    update: (cache, { data }) => {
      if (!data) return;

      const newTechnicianRecord = data?.createTechnicianRecord;
      const newCacheEdge = {
        __typename: 'TechnicianRecordEdge',
        cursor: newTechnicianRecord.id,
        node: {
          ...newTechnicianRecord,
          __typename: 'TechnicianRecord',
        },
      };

      cache.modify({
        fields: {
          getTechnicianRecords(existingTechnicianRecords = {}) {
            const updatedElevatorRecordEdges = [newCacheEdge, ...(existingTechnicianRecords.edges || [])];

            return {
              ...existingTechnicianRecords,
              edges: updatedElevatorRecordEdges,
              total: (existingTechnicianRecords.total || 0) + 1,
            };
          },
        },
      });
    },
  });

  const onCreateTechnicianRecord = async (formFields: TechnicianRecordFormFields): Promise<void> => {
    try {
      const {
        basicInformation: { fullName, contactInformation, employmentStatus, availabilityStatus },
        skillsAndCertifications: { skills, certifications },
      } = formFields;

      const technicianRecordPayload = {
        employmentStatus,
        availabilityStatus,
        contactInformation,
        skills,
        certifications,
      };

      const result = await createTechnicianRecord({
        variables: {
          input: { ...technicianRecordPayload, name: fullName },
        },
      });

      const hasErrors = !!result.errors?.length;

      if (hasErrors) {
        onHandleMutationErrors({
          message: DEFAULT_TECHNICIAN_RECORD_FAIL_MESSAGE,
          errors: result.errors,
          onFailure: onError,
        });
      } else {
        onSuccess?.(DEFAULT_TECHNICIAN_RECORD_SUCCESS_MESSAGE);
      }
    } catch (e) {
      onHandleMutationErrors({
        message: DEFAULT_TECHNICIAN_RECORD_FAIL_MESSAGE,
        error: e as ApolloError,
        onFailure: onError,
      });
    }
  };

  return { onCreateTechnicianRecord, isLoading: loading };
};

export default useCreateTechnicianRecord;
