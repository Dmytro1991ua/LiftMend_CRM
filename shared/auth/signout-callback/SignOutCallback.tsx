import { CallbackPageContent } from '../callback-page-content';
import { useProcessSignOut } from '../hooks/useProcessSignOut';

const DEFAULT_CALLBACK_PAGE_TITLE = 'Signing you out...';
const DEFAULT_CALLBACK_PAGE_SUBTITLE = 'Please wait while we redirect you to sign-in page.';

const SignOutCallback = () => {
  useProcessSignOut();

  return <CallbackPageContent subtitle={DEFAULT_CALLBACK_PAGE_SUBTITLE} title={DEFAULT_CALLBACK_PAGE_TITLE} />;
};

export default SignOutCallback;
