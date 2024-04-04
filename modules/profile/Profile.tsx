import { HiPlus } from 'react-icons/hi';

import { Button } from '@/components/ui/button';
import SectionHeader from '@/shared/section-header';
import { SectionHeaderTitle } from '@/types/enums';

const Profile = (): React.JSX.Element => {
  //TODO: Example on how to use actionComponent for SectionHeader
  const sectionHeaderButton = (
    <Button>
      <HiPlus />
      <span className='ml-2'>Add Task</span>
    </Button>
  );

  return (
    <section>
      <SectionHeader actionComponent={sectionHeaderButton} title={SectionHeaderTitle.Profile} />
      <div className='content-wrapper'>Profile content</div>
    </section>
  );
};

export default Profile;
