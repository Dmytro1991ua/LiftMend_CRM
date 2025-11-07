import { CallbackPageContent } from '../callback-page-content';
import { useProcessAuth } from '../hooks';

const OAuthCallback = () => {
  const { welcomeMessage } = useProcessAuth();

  return <CallbackPageContent subtitle='Please wait while we redirect you to your dashboard.' title={welcomeMessage} />;
};

export default OAuthCallback;
