import gql from 'graphql-tag';

import { REPAIR_JOB_FRAGMENT } from '@/graphql/fragments';

export const GET_RECENT_REPAIR_JOBS = gql`
  query GetRecentRepairJobs($jobsCount: Int) {
    getRecentRepairJobs(jobsCount: $jobsCount) {
      status
      ...RepairJobFields
    }
  }

  ${REPAIR_JOB_FRAGMENT}
`;
