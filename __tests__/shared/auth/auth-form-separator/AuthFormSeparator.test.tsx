import { render, screen } from '@testing-library/react';

import AuthFormSeparator from '@/shared/auth/auth-form-separator';

describe('AuthFormSeparator', () => {
  it('should render component without crashing', () => {
    render(<AuthFormSeparator />);

    expect(screen.getByText('or continue with')).toBeInTheDocument();
  });
});
