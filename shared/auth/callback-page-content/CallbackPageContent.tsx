import { Hourglass } from 'react-loader-spinner';

import Logo from '@/shared/logo';

type CallbackPageContentProps = {
  title: JSX.Element | string;
  subtitle?: string;
};

const CallbackPageContent = ({ title, subtitle }: CallbackPageContentProps) => {
  return (
    <section className='min-h-screen flex flex-col justify-center items-center text-center p-4'>
      <Logo labelClassName='ml-2' wrapperClassName='mb-4 border-b-0 ' />
      <h1 className='text-2xl font-bold mb-2'>{title}</h1>
      <p className='mb-2'>{subtitle}</p>
      <Hourglass ariaLabel='hourglass-loading' colors={['#306cce', '#72a1ed']} height='30' visible={true} width='30' />
    </section>
  );
};

export default CallbackPageContent;
