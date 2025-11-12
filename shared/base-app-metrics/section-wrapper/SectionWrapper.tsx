type SectionWrapperProps<T> = {
  title: T;
  children?: React.ReactNode;
};

const SectionWrapper = <T,>({ title, children }: SectionWrapperProps<T>) => {
  return (
    <section className='flex flex-col py-4 px-6 bg-background rounded-[2rem] mb-4 last:mb-0'>
      <h2 className='font-bold text-xl mb-2'>{title}</h2>
      <>{children}</>
    </section>
  );
};

export default SectionWrapper;
