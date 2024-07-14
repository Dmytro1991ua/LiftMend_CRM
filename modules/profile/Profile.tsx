import { HiPlus } from 'react-icons/hi';

import { Button } from '@/components/ui/button';
import BaseCalendar from '@/shared/base-calendar';
import BaseStepper from '@/shared/base-stepper';
import { useBaseToast } from '@/shared/hooks';
import { BaseToastVariant } from '@/shared/hooks/useBaseToast/types';
import SectionHeader from '@/shared/section-header';
import { SectionHeaderTitle } from '@/types/enums';
import { ConfigMap } from '@/types/type';

// TODO move to a type file when Repair Job Tracking Page is created
// Define an enum for steps
enum Steps {
  JobDetails,
  ElevatorInformation,
  TechnicianAssignment,
}

// TODO move to a type file when Repair Job Tracking Page is created
// Object literal mapping steps to content components
const stepContentConfig: ConfigMap<Steps> = {
  [Steps.JobDetails]: 'Job Details',
  [Steps.ElevatorInformation]: 'Elevator Information',
  [Steps.TechnicianAssignment]: 'Technician Assignment',
};

const Profile = (): React.JSX.Element => {
  const { baseToast } = useBaseToast(BaseToastVariant.Info);

  // TODO move to a constant file when Repair Job Tracking Page is created
  const steps = [
    { id: Steps.JobDetails, value: 'Job Details' },
    { id: Steps.ElevatorInformation, value: 'Elevator Information' },
    { id: Steps.TechnicianAssignment, value: 'Technician Assignment' },
  ];

  //TODO: Example on how to use actionComponent for SectionHeader
  const sectionHeaderButton = (
    <Button onClick={() => baseToast('Error Occurred')}>
      <HiPlus />
      <span className='ml-2'>Add Task</span>
    </Button>
  );

  return (
    <section>
      <SectionHeader actionComponent={sectionHeaderButton} title={SectionHeaderTitle.Profile} />
      <div className='content-wrapper md:h-[75vh] overflow-y-auto overflow-x-hidden'>
        <BaseCalendar />
        <BaseStepper stepContentConfig={stepContentConfig} steps={steps} />
      </div>
    </section>
  );
};

export default Profile;
