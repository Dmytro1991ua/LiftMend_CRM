import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';

import { GET_TEST_QUERY } from '@/graphql/schemas/getTestQuery';
import Home from '@/pages/index';

describe('Home', () => {
  const mocks = [
    {
      request: {
        query: GET_TEST_QUERY,
      },
      result: {
        data: [],
      },
    },
  ];

  it('should render components without crashing', () => {
    render(
      <MockedProvider addTypename={false} mocks={mocks}>
        <Home />
      </MockedProvider>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
  });
});
