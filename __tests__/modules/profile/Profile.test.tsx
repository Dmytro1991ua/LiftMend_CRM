import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';

import Profile from '@/modules/profile';
import { SectionHeaderTitle } from '@/types/enums';

describe('Profile', () => {
  it('should render component without crashing', () => {
    render(
      <MockedProvider mocks={[]}>
        <Profile />
      </MockedProvider>
    );

    expect(screen.getByText(SectionHeaderTitle.Profile)).toBeInTheDocument();
    expect(screen.getByText('Profile Page')).toBeInTheDocument();
  });
});
