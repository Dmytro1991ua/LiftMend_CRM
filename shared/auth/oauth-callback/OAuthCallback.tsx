import { Hourglass } from 'react-loader-spinner';

import Logo from '@/shared/logo';

import { useProcessAuth } from '../hooks';

const OAuthCallback = () => {
  const { welcomeMessage } = useProcessAuth();

  return (
    <section className='min-h-screen flex flex-col justify-center items-center text-center p-4'>
      <Logo wrapperClassName='mb-4 border-b-0 ' />
      <h1 className='text-2xl font-bold mb-2'>{welcomeMessage}</h1>
      <p className='mb-2'>Please wait while we redirect you to your dashboard.</p>
      <Hourglass ariaLabel='hourglass-loading' colors={['#306cce', '#72a1ed']} height='30' visible={true} width='30' />
    </section>
  );
};

export default OAuthCallback;
