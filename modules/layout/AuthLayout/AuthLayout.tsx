import NavigationLoadingWrapper from '@/shared/navigation-loading-wrapper';

type AuthLayoutProps = {
  children?: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <NavigationLoadingWrapper>
      <section className='flex min-h-screen items-center justify-center bg-background'>{children}</section>
    </NavigationLoadingWrapper>
  );
};

export default AuthLayout;
