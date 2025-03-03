import SignInForm from '@/modules/auth/sign-in-form/SignInForm';
import AuthLayout from '@/modules/layout/AuthLayout';
import { NextPageWithLayout } from '@/shared/types';

const SignInPage: NextPageWithLayout = () => {
  return <SignInForm />;
};

SignInPage.getLayout = (page: React.ReactElement) => <AuthLayout>{page}</AuthLayout>;

export default SignInPage;
