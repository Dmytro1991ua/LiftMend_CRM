import { useRouter } from 'next/router';
import { Audio } from 'react-loader-spinner';

import QueryResponse from '@/shared/query-response';
import { getCalendarEventInfo } from '@/shared/utils';

import RepairJobContent from './components/repair-job-content';
import RepairJobHeader from './components/repair-job-header';
import { repairJobSectionsConfig } from './config';
import useFetchRepairJobById from './hooks';

const RepairJobDetails = () => {
  const {
    query: { repairJobId },
  } = useRouter();

  const { repairJob, loading, error } = useFetchRepairJobById(repairJobId as string);

  const repairJobSections = repairJobSectionsConfig(repairJob);

  const { description, title } = getCalendarEventInfo({
    elevatorType: repairJob.elevatorType,
    elevatorLocation: repairJob.elevatorLocation,
    buildingName: repairJob.buildingName,
    jobType: repairJob.jobType,
  });

  return (
    <section>
      <RepairJobHeader description={description} loading={loading} title={title} />
      <div className='content-wrapper h-[73vh] overflow-y-auto overflow-x-hidden'>
        <>
          <QueryResponse
            errorDescription={error}
            errorMessage={`Failed to fetch Repair Job Details by ${repairJobId}`}
            loading={loading}
            loadingComponent={
              <Audio
                ariaLabel='bars-loading'
                color='#2563eb'
                height='80'
                visible={true}
                width='80'
                wrapperClass='h-full items-center justify-center'
              />
            }
          />
          <RepairJobContent error={error} loading={loading} repairJobSections={repairJobSections} />
        </>
      </div>
    </section>
  );
};

export default RepairJobDetails;
