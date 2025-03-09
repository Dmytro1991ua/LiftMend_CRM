import ForgotPasswordForm from '@/modules/auth/forgot-password-form';
import AuthLayout from '@/modules/layout/AuthLayout';
import { NextPageWithLayout } from '@/shared/types';

const ForgotPasswordPage: NextPageWithLayout = () => {
  return <ForgotPasswordForm />;
};

ForgotPasswordPage.getLayout = (page: React.ReactElement) => <AuthLayout>{page}</AuthLayout>;

export default ForgotPasswordPage;
