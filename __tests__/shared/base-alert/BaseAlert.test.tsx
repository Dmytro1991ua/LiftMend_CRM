import { render, screen } from '@testing-library/react';

import BaseAlert from '@/shared/base-alert/BaseAlert';
import { AlertVariant } from '@/shared/base-alert/types';

describe('BaseAlert', () => {
  const mockDefaultProps = { title: 'Test title', description: 'Test description', variant: AlertVariant.Default };

  it('should render component without crashing', () => {
    render(<BaseAlert {...mockDefaultProps} />);

    expect(screen.getByTestId('base-alert')).toBeInTheDocument();
    expect(screen.getByTestId('default-alert-variant')).toBeInTheDocument();
    expect(screen.getByText('Test title')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('should render info alert icon', () => {
    render(<BaseAlert {...mockDefaultProps} variant={AlertVariant.Info} />);

    expect(screen.getByTestId('info-alert-variant')).toBeInTheDocument();
  });

  it('should render error alert icon', () => {
    render(<BaseAlert {...mockDefaultProps} variant={AlertVariant.Error} />);

    expect(screen.getByTestId('error-alert-variant')).toBeInTheDocument();
  });

  it('should render warning alert icon', () => {
    render(<BaseAlert {...mockDefaultProps} variant={AlertVariant.Warning} />);

    expect(screen.getByTestId('warning-alert-variant')).toBeInTheDocument();
  });

  it('should render success alert icon', () => {
    render(<BaseAlert {...mockDefaultProps} variant={AlertVariant.Success} />);

    expect(screen.getByTestId('success-alert-variant')).toBeInTheDocument();
  });

  it('should not render icon when variant is null', () => {
    render(<BaseAlert variant={undefined} />);

    expect(screen.queryByTestId('default-alert-variant')).not.toBeInTheDocument();
  });
});
