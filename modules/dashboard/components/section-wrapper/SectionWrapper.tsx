import { SectionTitle } from '../../types';

type SectionWrapperProps = {
  title: SectionTitle;
  children?: React.ReactNode;
};

const SectionWrapper = ({ title, children }: SectionWrapperProps) => {
  return (
    <section className='flex flex-col py-4 px-6 bg-background rounded-[2rem]'>
      <h2 className='font-bold text-xl mb-2'>{title}</h2>
      <>{children}</>
    </section>
  );
};

export default SectionWrapper;
