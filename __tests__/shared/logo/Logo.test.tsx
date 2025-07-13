import { render, screen } from '@testing-library/react';

import Logo, { LOGO_LABEL, LogoProps } from '@/shared/logo/Logo';

describe('Logo', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    iconClassName: '',
    wrapperClassName: '',
    labelClassName: '',
    isLabelShown: false,
  };

  const LogoComponent = (props?: Partial<LogoProps>) => <Logo {...defaultProps} {...props} />;

  it('should render component without crashing', () => {
    render(LogoComponent());

    expect(screen.getByTestId('logo-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('logo-icon')).toBeInTheDocument();
  });

  it('should render label if isLabelShown is true', () => {
    render(LogoComponent({ isLabelShown: true }));

    expect(screen.getByText(LOGO_LABEL)).toBeInTheDocument();
  });
});
