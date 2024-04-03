import { render, screen } from '@testing-library/react';

import Profile from '@/modules/profile';

describe('Profile', () => {
  it('should render component without crashing', () => {
    render(<Profile />);

    expect(screen.getByText('Profile')).toBeInTheDocument();
  });
});
