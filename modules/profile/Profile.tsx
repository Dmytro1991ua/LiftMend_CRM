import { HiPlus } from 'react-icons/hi';

import { Button } from '@/components/ui/button';
import BaseCalendar from '@/shared/base-calendar';
import { useBaseToast } from '@/shared/hooks';
import { BaseToastVariant } from '@/shared/hooks/useBaseToast/types';
import SectionHeader from '@/shared/section-header';
import { SectionHeaderTitle } from '@/types/enums';

const Profile = (): React.JSX.Element => {
  const { baseToast } = useBaseToast(BaseToastVariant.Info);

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
      </div>
    </section>
  );
};

export default Profile;
