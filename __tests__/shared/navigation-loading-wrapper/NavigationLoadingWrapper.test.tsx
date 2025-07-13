import { render, screen } from '@testing-library/react';

import { useNavigationLoading } from '@/shared/hooks';
import NavigationLoadingWrapper from '@/shared/navigation-loading-wrapper';

jest.mock('@/shared/hooks', () => ({
  ...jest.requireActual('@/shared/hooks'),
  useNavigationLoading: jest.fn(),
}));

describe('NavigationLoadingWrapper', () => {
  const mockChildren = 'Test Navigation Loading Wrapper Content';

  beforeEach(() => {
    (useNavigationLoading as jest.Mock).mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const NavigationLoadingWrapperComponent = () => (
    <NavigationLoadingWrapper>
      <p>{mockChildren}</p>
    </NavigationLoadingWrapper>
  );

  it('should render the wrapper when not redirecting', () => {
    render(NavigationLoadingWrapperComponent());

    expect(screen.getByTestId('navigation-wrapper')).toBeInTheDocument();
  });

  it('should render the loader when redirecting', () => {
    (useNavigationLoading as jest.Mock).mockReturnValue(true);

    render(NavigationLoadingWrapperComponent());

    expect(screen.getByTestId('three-circles-svg')).toBeInTheDocument();
  });
});
