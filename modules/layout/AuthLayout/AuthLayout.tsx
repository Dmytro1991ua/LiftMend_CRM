type AuthLayoutProps = {
  children?: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return <section className='flex min-h-screen items-center justify-center bg-background'>{children}</section>;
};

export default AuthLayout;
