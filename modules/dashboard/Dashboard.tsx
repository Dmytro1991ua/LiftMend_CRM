import { Button } from '@/components/ui/button';
import BaseCard from '@/shared/base-card';
import DatePicker from '@/shared/date-picker';
import SectionHeader from '@/shared/section-header';
import { SectionHeaderTitle } from '@/types/enums';

const Dashboard = () => {
  // TODO: Example of Card Footer content
  const footerContent = (
    <>
      <Button className='w-full' variant='outline'>
        Cancel
      </Button>
      <Button className='w-full'>Deploy</Button>
    </>
  );

  return (
    <div className='flex flex-col'>
      <SectionHeader actionComponent={<DatePicker />} title={SectionHeaderTitle.Dashboard} />
      <div className='content-wrapper'>
        <BaseCard
          cardClassName='w-2/4'
          description='Deploy your new project in one-click.'
          footerClassName='flex gap-2 w-full pt-4 border-t-2'
          footerContent={footerContent}
          title='Create project'>
          <p>Card Content</p>
        </BaseCard>
      </div>
    </div>
  );
};

export default Dashboard;
