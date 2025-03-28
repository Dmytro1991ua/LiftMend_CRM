import { ProfileContentSubtitle, ProfileContentTitle } from '../../types';

type ProfileContentWrapperProps = {
  title: ProfileContentTitle;
  subtitle: ProfileContentSubtitle;
  children: React.JSX.Element;
  className?: string;
};

const ProfileContentWrapper = ({ title, subtitle, children }: ProfileContentWrapperProps) => {
  return (
    <section className='flex flex-col w-11/12 2xl:w-2/3 mb-8'>
      <h3 className='mb-4 text-2xl font-bold text-center'>{title}</h3>
      <div className='bg-background p-4 border-4 rounded-xl border-primary shadow-xl'>
        <h4 className='mb-6 border-b-2 border-primary pb-2 text-xl text-center'>{subtitle}</h4>
        {children}
      </div>
    </section>
  );
};

export default ProfileContentWrapper;
