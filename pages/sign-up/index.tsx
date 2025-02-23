import SignUpForm from '@/modules/auth/sign-up-form/SignUpForm';
import AuthLayout from '@/modules/layout/AuthLayout';
import { NextPageWithLayout } from '@/shared/types';
import React from 'react';

const SignUpPage: NextPageWithLayout = () => {
  return <SignUpForm />;
};

SignUpPage.getLayout = (page: React.ReactElement) => <AuthLayout>{page}</AuthLayout>;

export default SignUpPage;
