import ResetPasswordForm from '@/modules/auth/reset-password-form/ResetPasswordForm';
import AuthLayout from '@/modules/layout/AuthLayout';
import { NextPageWithLayout } from '@/shared/types';

const ResetPasswordPage: NextPageWithLayout = () => {
  return <ResetPasswordForm />;
};

ResetPasswordPage.getLayout = (page: React.ReactElement) => <AuthLayout>{page}</AuthLayout>;

export default ResetPasswordPage;
