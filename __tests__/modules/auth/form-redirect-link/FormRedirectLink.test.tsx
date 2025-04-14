import { render, screen } from '@testing-library/react';

import FormRedirectLink from '@/modules/auth/form-redirect-link/FormRedirectLink';

describe('FormRedirectLink', () => {
  const defaultProps = {
    route: '/forgot-password',
    title: 'Forgot Password',
  };

  it('should render component without crashing', () => {
    render(<FormRedirectLink {...defaultProps} />);

    expect(screen.getByText('Forgot Password')).toBeInTheDocument();
  });

  it('should redirect on link click', () => {
    render(<FormRedirectLink {...defaultProps} />);

    expect(screen.getByRole('link', { name: 'Forgot Password' })).toHaveAttribute('href', '/forgot-password');
  });
});
