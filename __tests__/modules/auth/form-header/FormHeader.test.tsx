import { render, screen } from '@testing-library/react';

import FormHeader from '@/modules/auth/form-header/FormHeader';
import { AuthFormHeader } from '@/modules/auth/types';

describe('FormHeader', () => {
  const mockDefaultProps = {
    formHeaders: {
      title: AuthFormHeader.FORGOT_PASSWORD_TITLE,
      description: AuthFormHeader.FORGOT_PASSWORD_DESCRIPTION,
    },
  };

  it('should render component without crashing', () => {
    render(<FormHeader {...mockDefaultProps} />);

    expect(screen.getByText(AuthFormHeader.FORGOT_PASSWORD_TITLE)).toBeInTheDocument();
    expect(screen.getByText(AuthFormHeader.FORGOT_PASSWORD_DESCRIPTION)).toBeInTheDocument();
  });
});
