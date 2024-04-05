import { render, screen } from '@testing-library/react';

import UserAvatar from '@/shared/user-avatar';

describe('UserAvatar', () => {
  const mockDefaultProps = {
    imageSrc: 'http://test.imagemagick.com',
    imageFallback: 'CN',
  };

  it('should render component without crashing', () => {
    render(<UserAvatar {...mockDefaultProps} />);

    expect(screen.getByTestId('user-avatar')).toBeInTheDocument();
  });
});
